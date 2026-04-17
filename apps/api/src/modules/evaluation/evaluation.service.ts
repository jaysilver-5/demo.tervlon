import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class EvaluationService {
  constructor(
    private prisma: PrismaService,
    private ai: AiService,
  ) {}

  async evaluate(sessionId: string) {
    const { session, currentTicket, fileTree } = await this.getSessionContext(sessionId);

    const codeFiles = this.extractCodeFiles(fileTree);
    const timeSpentMinutes = Math.round(
      (Date.now() - new Date(session.startedAt).getTime()) / 60000,
    );
    const timeScore = this.computeTimeScore(timeSpentMinutes, currentTicket.estimatedMinutes);

    const aiReview = await this.runAiEvaluation(currentTicket, codeFiles);

    const codeQuality = Math.round(
      (aiReview.dimensions.naming.score +
        aiReview.dimensions.structure.score +
        aiReview.dimensions.errorHandling.score +
        aiReview.dimensions.patterns.score) / 4,
    );

    const requirementsMet = aiReview.requirementsMet || [];
    const metCount = requirementsMet.filter((r: any) => r.met).length;
    const technicalAccuracy =
      requirementsMet.length > 0
        ? Math.round((metCount / requirementsMet.length) * 100)
        : codeQuality;

    const overall = Math.round(
      technicalAccuracy * 0.5 + codeQuality * 0.35 + timeScore * 0.15,
    );

    const scores = {
      technicalAccuracy,
      codeQuality,
      timeManagement: Math.round(timeScore),
      overall,
    };

    const terminalOutput = this.formatTerminalOutput(scores, requirementsMet, aiReview);

    return { scores, aiReview, terminalOutput };
  }

  async submit(sessionId: string) {
    const { session, currentTicket, fileTree } = await this.getSessionContext(sessionId);

    // Save submission snapshot
    const snapshot = await this.prisma.workspaceSnapshot.findFirst({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
    });

    await this.prisma.workspaceSnapshot.create({
      data: {
        sessionId,
        snapshotType: 'SUBMISSION',
        fileTree: (snapshot?.fileTree as object) || {},
        chatHistory: (snapshot?.chatHistory as any) || [],
      },
    });

    // Run evaluation
    const codeFiles = this.extractCodeFiles(fileTree);
    const timeSpentMinutes = Math.round(
      (Date.now() - new Date(session.startedAt).getTime()) / 60000,
    );
    const timeScore = this.computeTimeScore(timeSpentMinutes, currentTicket.estimatedMinutes);
    const aiReview = await this.runAiEvaluation(currentTicket, codeFiles);

    const codeQuality = Math.round(
      (aiReview.dimensions.naming.score +
        aiReview.dimensions.structure.score +
        aiReview.dimensions.errorHandling.score +
        aiReview.dimensions.patterns.score) / 4,
    );

    const requirementsMet = aiReview.requirementsMet || [];
    const metCount = requirementsMet.filter((r: any) => r.met).length;
    const technicalAccuracy =
      requirementsMet.length > 0
        ? Math.round((metCount / requirementsMet.length) * 100)
        : codeQuality;

    const overall = Math.round(
      technicalAccuracy * 0.5 + codeQuality * 0.35 + timeScore * 0.15,
    );

    const scores = {
      technicalAccuracy,
      codeQuality,
      timeManagement: Math.round(timeScore),
      overall,
    };

    const startTime = Date.now();
    const evaluation = await this.prisma.ticketEvaluation.create({
      data: {
        sessionId,
        ticketId: currentTicket.id,
        testResults: { requirementsMet } as any,
        aiReview: aiReview as any,
        scores: scores as any,
        terminalOutput: this.formatTerminalOutput(scores, requirementsMet, aiReview),
        usedReset: false,
        evaluationDuration: Date.now() - startTime,
      },
    });

    const passed = overall >= (currentTicket.minimumPassRate * 100);
    const totalTickets = session.simulation.tickets.length;
    const isLastTicket = currentTicket.sequence === totalTickets;

    // If passed, advance to next ticket
    if (passed && !isLastTicket) {
      await this.prisma.workspaceSession.update({
        where: { id: sessionId },
        data: { currentTicketSeq: currentTicket.sequence + 1 },
      });

      // Check for triggers
      const triggers = await this.prisma.trigger.findMany({
        where: { simulationId: session.simulationId },
      });

      let triggerMessage: string | null = null;
      for (const trigger of triggers) {
        const condition = trigger.condition as any;
        if (
          condition.type === 'AFTER_TICKET' &&
          condition.ticketSequence === currentTicket.sequence
        ) {
          triggerMessage = trigger.pmMessage;
        }
      }

      return {
        status: 'passed',
        scores,
        aiReview,
        terminalOutput: evaluation.terminalOutput,
        nextTicketSeq: currentTicket.sequence + 1,
        triggerMessage,
        isComplete: false,
      };
    }

    // If passed and last ticket — simulation complete
    if (passed && isLastTicket) {
      await this.prisma.workspaceSession.update({
        where: { id: sessionId },
        data: { status: 'COMPLETED' },
      });

      return {
        status: 'complete',
        scores,
        aiReview,
        terminalOutput: evaluation.terminalOutput,
        nextTicketSeq: null,
        triggerMessage: null,
        isComplete: true,
      };
    }

    // If not passed
    return {
      status: 'below_threshold',
      scores,
      aiReview,
      terminalOutput: evaluation.terminalOutput,
      minimumRequired: Math.round(currentTicket.minimumPassRate * 100),
      nextTicketSeq: null,
      triggerMessage: null,
      isComplete: false,
    };
  }

  async reset(sessionId: string, ticketSeq: number) {
    const session = await this.prisma.workspaceSession.findUnique({
      where: { id: sessionId },
      include: {
        simulation: {
          include: { tickets: { orderBy: { sequence: 'asc' } } },
        },
      },
    });

    if (!session) throw new NotFoundException('Session not found');

    const ticket = session.simulation.tickets.find((t) => t.sequence === ticketSeq);
    if (!ticket) throw new NotFoundException('Ticket not found');

    // Create evaluation record with capped score
    await this.prisma.ticketEvaluation.create({
      data: {
        sessionId,
        ticketId: ticket.id,
        testResults: {} as any,
        aiReview: { note: 'Reset — reference implementation accepted' } as any,
        scores: {
          technicalAccuracy: Math.round(ticket.minimumPassRate * 100),
          codeQuality: Math.round(ticket.minimumPassRate * 100),
          timeManagement: 50,
          overall: Math.round(ticket.minimumPassRate * 100),
        } as any,
        terminalOutput: `Reset accepted for ${ticket.title}. Score capped at ${Math.round(ticket.minimumPassRate * 100)}%.`,
        usedReset: true,
        evaluationDuration: 0,
      },
    });

    // Advance to next ticket
    const totalTickets = session.simulation.tickets.length;
    const isLast = ticket.sequence === totalTickets;

    if (!isLast) {
      await this.prisma.workspaceSession.update({
        where: { id: sessionId },
        data: { currentTicketSeq: ticket.sequence + 1 },
      });
    } else {
      await this.prisma.workspaceSession.update({
        where: { id: sessionId },
        data: { status: 'COMPLETED' },
      });
    }

    return {
      status: isLast ? 'complete' : 'advanced',
      nextTicketSeq: isLast ? null : ticket.sequence + 1,
      isComplete: isLast,
    };
  }

  async getReport(sessionId: string) {
    const session = await this.prisma.workspaceSession.findUnique({
      where: { id: sessionId },
      include: {
        simulation: {
          include: { tickets: { orderBy: { sequence: 'asc' } } },
        },
        evaluations: {
          include: { ticket: true },
          orderBy: { submittedAt: 'asc' },
        },
      },
    });

    if (!session) throw new NotFoundException('Session not found');

    const ticketScores = session.evaluations.map((ev: any) => ({
      ticketId: ev.ticketId,
      sequence: ev.ticket.sequence,
      title: ev.ticket.title,
      scores: ev.scores,
      usedReset: ev.usedReset,
      aiReview: ev.aiReview,
    }));

    const avgScores = {
      technicalAccuracy: 0,
      codeQuality: 0,
      timeManagement: 0,
      overall: 0,
    };

    if (ticketScores.length > 0) {
      for (const ts of ticketScores) {
        avgScores.technicalAccuracy += ts.scores.technicalAccuracy;
        avgScores.codeQuality += ts.scores.codeQuality;
        avgScores.timeManagement += ts.scores.timeManagement;
        avgScores.overall += ts.scores.overall;
      }
      avgScores.technicalAccuracy = Math.round(avgScores.technicalAccuracy / ticketScores.length);
      avgScores.codeQuality = Math.round(avgScores.codeQuality / ticketScores.length);
      avgScores.timeManagement = Math.round(avgScores.timeManagement / ticketScores.length);
      avgScores.overall = Math.round(avgScores.overall / ticketScores.length);
    }

    // Generate holistic summary
    let aiSummary = '';
    try {
      const ticketSummaries = ticketScores
        .map(
          (ts: any) =>
            `${ts.title}: ${ts.scores.overall}%${ts.usedReset ? ' (reset used)' : ''}`,
        )
        .join('\n');

      aiSummary = await this.ai.chat(
        'evaluator',
        `You are writing a final performance summary for a developer who just completed a simulated engineering sprint.

SIMULATION: ${session.simulation.title}

TICKET SCORES:
${ticketSummaries}

OVERALL: ${avgScores.overall}%

Write a 2-3 paragraph holistic review. Be encouraging but honest. Mention specific strengths and areas for growth. Keep it under 200 words.`,
        [{ role: 'user', content: 'Generate the final performance summary.' }],
      );
    } catch {
      aiSummary = 'Performance summary could not be generated.';
    }

    const totalMinutes = Math.round(
      (Date.now() - new Date(session.startedAt).getTime()) / 60000,
    );

    return {
      simulation: {
        title: session.simulation.title,
        totalTickets: session.simulation.tickets.length,
      },
      scores: avgScores,
      ticketScores,
      aiSummary,
      totalDuration: totalMinutes,
      completedAt: new Date().toISOString(),
      resetsUsed: ticketScores.filter((t: any) => t.usedReset).length,
    };
  }

  // ── Private helpers ──────────────────────────────────────

  private async getSessionContext(sessionId: string) {
    const session = await this.prisma.workspaceSession.findUnique({
      where: { id: sessionId },
      include: {
        simulation: {
          include: { tickets: { orderBy: { sequence: 'asc' } } },
        },
      },
    });

    if (!session) throw new NotFoundException('Session not found');

    const currentTicket = session.simulation.tickets.find(
      (t) => t.sequence === session.currentTicketSeq,
    );
    if (!currentTicket) throw new NotFoundException('No active ticket');

    const snapshot = await this.prisma.workspaceSnapshot.findFirst({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
    });
    if (!snapshot) throw new NotFoundException('No code to evaluate');

    const fileTree = snapshot.fileTree as Record<string, string>;

    return { session, currentTicket, fileTree };
  }

  private extractCodeFiles(fileTree: Record<string, string>): string {
    return Object.entries(fileTree)
      .filter(
        ([path, content]) =>
          content.length > 0 &&
          !path.endsWith('.gitkeep') &&
          !path.endsWith('.md') &&
          path !== '.env',
      )
      .map(([path, content]) => {
        const truncated =
          content.length > 1500
            ? content.slice(0, 1500) + '\n// ... truncated'
            : content;
        return `--- ${path} ---\n${truncated}`;
      })
      .join('\n\n');
  }

  private computeTimeScore(spent: number, estimated: number): number {
    const ratio = spent / (estimated || 30);
    if (ratio >= 0.5 && ratio <= 1.5) return 100;
    return Math.max(0, 100 - Math.abs(1 - ratio) * 60);
  }

  private async runAiEvaluation(ticket: any, codeFiles: string) {
    const prompt = `You are a senior backend engineer conducting a code review for a simulated engineering assessment.

TICKET: ${ticket.title}

TICKET BRIEF:
${ticket.brief}

EVALUATION CRITERIA:
${JSON.stringify(ticket.evaluationCriteria)}

STUDENT'S CODE:
${codeFiles || '(No code files found)'}

Evaluate the student's code against the ticket requirements. Be specific — reference actual function names, file names, and concrete improvements.

Return ONLY valid JSON (no markdown, no backticks, no explanation before or after the JSON) with this exact structure:
{
  "dimensions": {
    "naming": { "score": 0-100, "summary": "one sentence", "detail": "2-3 sentences with specific code references" },
    "structure": { "score": 0-100, "summary": "one sentence", "detail": "2-3 sentences" },
    "errorHandling": { "score": 0-100, "summary": "one sentence", "detail": "2-3 sentences" },
    "patterns": { "score": 0-100, "summary": "one sentence", "detail": "2-3 sentences" }
  },
  "highlights": {
    "strengths": ["specific thing done well", "another strength"],
    "improvements": ["specific actionable fix", "another improvement"]
  },
  "requirementsMet": [
    { "criterion": "requirement from ticket", "met": true, "note": "brief explanation" }
  ],
  "overallReview": "2-3 paragraph holistic review like a real PR comment. Reference specific code. Explain WHY things matter. Give clear next steps."
}

IMPORTANT: Your entire response must be valid JSON. Do not include any text before or after the JSON object.`;

    try {
      const responseText = await this.ai.chat(
        'evaluator',
        prompt,
        [{ role: 'user', content: 'Please evaluate the code submission. Return only JSON.' }],
        2000,
      );
      const cleaned = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.error('AI evaluation parse failed, retrying...', e);
      try {
        const retryText = await this.ai.chat(
          'evaluator',
          prompt + '\n\nCRITICAL: Return ONLY the JSON object. No markdown fences. No explanation.',
          [{ role: 'user', content: 'Return only the JSON evaluation object.' }],
          2000,
        );
        const cleaned = retryText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        return JSON.parse(cleaned);
      } catch (retryError) {
        console.error('AI evaluation retry also failed:', retryError);
        return {
          dimensions: {
            naming: { score: 50, summary: 'Unable to evaluate', detail: 'AI review error. Try again.' },
            structure: { score: 50, summary: 'Unable to evaluate', detail: 'AI review error.' },
            errorHandling: { score: 50, summary: 'Unable to evaluate', detail: 'AI review error.' },
            patterns: { score: 50, summary: 'Unable to evaluate', detail: 'AI review error.' },
          },
          highlights: { strengths: [], improvements: ['Try submitting again'] },
          requirementsMet: [],
          overallReview: 'The AI reviewer encountered an error. Please try again.',
        };
      }
    }
  }

  private formatTerminalOutput(scores: any, requirementsMet: any[], aiReview: any): string {
    const lines = [
      '$ tervlon evaluate --ticket current',
      '',
      '─── Requirements Check ───',
    ];

    if (requirementsMet.length === 0) {
      lines.push('(No specific requirements evaluated)');
    } else {
      for (const req of requirementsMet) {
        lines.push(
          `${req.met ? '✓' : '✗'} ${req.criterion}${req.note ? ` — ${req.note}` : ''}`,
        );
      }
    }

    lines.push('', '─── Scores ───');
    lines.push(`Technical Accuracy:  ${scores.technicalAccuracy}%`);
    lines.push(`Code Quality:        ${scores.codeQuality}%`);
    lines.push(`Time Management:     ${scores.timeManagement}%`);
    lines.push('──────────────────────');
    lines.push(`Overall:             ${scores.overall}%`);

    const strengths = aiReview.highlights?.strengths || [];
    if (strengths.length > 0) {
      lines.push('', '─── Strengths ───');
      for (const s of strengths) lines.push(`✓ ${s}`);
    }

    const improvements = aiReview.highlights?.improvements || [];
    if (improvements.length > 0) {
      lines.push('', '─── Improvements ───');
      for (const imp of improvements) lines.push(`→ ${imp}`);
    }

    return lines.join('\n');
  }
}