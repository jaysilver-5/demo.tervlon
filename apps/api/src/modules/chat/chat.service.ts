import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService, AiRole } from '../ai/ai.service';

type ChatMessage = {
  from: string;
  agent?: AiRole;
  text: string;
  timestamp: string;
};

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private ai: AiService,
  ) {}

  async sendMessage(
    sessionId: string,
    text: string,
    agent: AiRole,
  ) {
    // Get session with simulation and tickets
    const session = await this.prisma.workspaceSession.findUnique({
      where: { id: sessionId },
      include: {
        simulation: {
          include: { tickets: { orderBy: { sequence: 'asc' } } },
        },
      },
    });

    if (!session) throw new NotFoundException('Session not found');

    // Get current ticket
    const currentTicket = session.simulation.tickets.find(
      (t) => t.sequence === session.currentTicketSeq,
    );

    // Get latest snapshot for chat history and code context
    const snapshot = await this.prisma.workspaceSnapshot.findFirst({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
    });

    const chatHistory: ChatMessage[] = snapshot
      ? (snapshot.chatHistory as unknown as ChatMessage[])
      : [];

    // Build system prompt
    const systemPrompt = agent === 'pm'
      ? this.buildPmPrompt(session.simulation, currentTicket)
      : this.buildTeammatePrompt(currentTicket, snapshot?.fileTree as Record<string, string> | null);

    // Build message history for Claude (last 15 messages from this agent)
    const relevantHistory = chatHistory
      .filter((m) => m.agent === agent || m.from === 'user')
      .slice(-15)
      .map((m) => ({
        role: (m.from === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.text,
      }));

    // Add the new user message
    relevantHistory.push({ role: 'user', content: text });

    // Get AI response
    const response = await this.ai.chat(agent, systemPrompt, relevantHistory);

    // Create new messages
    const now = new Date().toISOString();
    const userMsg: ChatMessage = { from: 'user', text, timestamp: now };
    const aiMsg: ChatMessage = {
      from: agent === 'pm' ? 'AI PM' : 'AI Teammate',
      agent,
      text: response,
      timestamp: new Date().toISOString(),
    };

    // Update chat history in the latest snapshot or create new one
    const updatedHistory = [...chatHistory, userMsg, aiMsg];

    await this.prisma.workspaceSnapshot.create({
      data: {
        sessionId,
        snapshotType: 'AUTO_SAVE',
        fileTree: (snapshot?.fileTree as object) || {},
        chatHistory: updatedHistory as any,
      },
    });

    return { userMessage: userMsg, aiMessage: aiMsg };
  }

  async getWelcomeMessage(sessionId: string) {
    const session = await this.prisma.workspaceSession.findUnique({
      where: { id: sessionId },
      include: {
        simulation: {
          include: { tickets: { orderBy: { sequence: 'asc' } } },
        },
      },
    });

    if (!session) throw new NotFoundException('Session not found');

    // Check if welcome was already sent
    const snapshot = await this.prisma.workspaceSnapshot.findFirst({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
    });

    const chatHistory: ChatMessage[] = snapshot
      ? (snapshot.chatHistory as unknown as ChatMessage[])
      : [];

    if (chatHistory.some((m) => m.from === 'AI PM')) {
      return { alreadySent: true, chatHistory };
    }

    const currentTicket = session.simulation.tickets.find(
      (t) => t.sequence === session.currentTicketSeq,
    );

    const systemPrompt = this.buildPmPrompt(session.simulation, currentTicket);

    const welcomeText = await this.ai.chat('pm', systemPrompt, [
      {
        role: 'user',
        content:
          'I just opened the workspace. Give me a brief welcome and tell me about my current ticket. Keep it conversational — 2 to 3 sentences max.',
      },
    ]);

    const welcomeMsg: ChatMessage = {
      from: 'AI PM',
      agent: 'pm',
      text: welcomeText,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [...chatHistory, welcomeMsg];

    await this.prisma.workspaceSnapshot.create({
      data: {
        sessionId,
        snapshotType: 'AUTO_SAVE',
        fileTree: (snapshot?.fileTree as object) || {},
        chatHistory: updatedHistory as any,
      },
    });

    return { alreadySent: false, message: welcomeMsg, chatHistory: updatedHistory };
  }

  async getHistory(sessionId: string) {
    const snapshot = await this.prisma.workspaceSnapshot.findFirst({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
    });

    return snapshot
      ? (snapshot.chatHistory as unknown as ChatMessage[])
      : [];
  }

  private buildPmPrompt(
    simulation: { title: string; description: string; tickets: any[] },
    currentTicket: any,
  ): string {
    const ticketList = simulation.tickets
      .map(
        (t: any) =>
          `${t.sequence}. ${t.title} ${t.sequence < currentTicket?.sequence ? '(completed)' : t.sequence === currentTicket?.sequence ? '(current)' : '(upcoming)'}`,
      )
      .join('\n');

    return `You are an AI Project Manager for a simulated engineering project.

PROJECT: ${simulation.title}
CONTEXT: ${simulation.description}

CURRENT TICKET: ${currentTicket?.title || 'None'}
${currentTicket?.brief || ''}

SPRINT TICKETS:
${ticketList}

RULES:
- You are a PM, not an engineer. Never write code or give code snippets.
- Answer requirement questions by referencing the ticket brief.
- Be conversational, professional, and concise.
- If asked about implementation details, say "That's an engineering decision — I trust your judgment" or similar.
- If asked something outside the ticket scope, redirect to the current task.
- Keep responses to 2-4 sentences. Be direct.
- You can be slightly vague like a real PM sometimes.`;
  }

  private buildTeammatePrompt(
    currentTicket: any,
    fileTree: Record<string, string> | null,
  ): string {
    let codeContext = '';
    if (fileTree) {
      const relevantFiles = Object.entries(fileTree)
        .filter(
          ([path]) =>
            path.endsWith('.ts') &&
            !path.includes('.gitkeep') &&
            !path.includes('node_modules'),
        )
        .slice(0, 5);

      if (relevantFiles.length > 0) {
        codeContext = '\n\nCURRENT CODEBASE:\n' +
          relevantFiles
            .map(([path, content]) => {
              const truncated = content.length > 800 ? content.slice(0, 800) + '\n// ... truncated' : content;
              return `--- ${path} ---\n${truncated}`;
            })
            .join('\n\n');
      }
    }

    return `You are an AI Teammate — a mid-level backend engineer working alongside the developer.

CURRENT TASK: ${currentTicket?.title || 'None'}
${currentTicket?.brief || ''}
${codeContext}

RULES:
- Help with concepts, patterns, and approaches.
- You can provide code snippets and examples when helpful.
- Reference the developer's actual code when relevant.
- Don't solve the entire ticket — guide, don't do.
- If they're stuck, give a nudge in the right direction.
- Keep responses focused and under 150 words.
- Be friendly and collaborative, like a real teammate.`;
  }
}