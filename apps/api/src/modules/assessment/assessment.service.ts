import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { nanoid } from 'nanoid';

@Injectable()
export class AssessmentService {
  constructor(private prisma: PrismaService) {}

  async create(
    creatorId: string,
    simulationId: string,
    title: string,
    settings: {
      aiTeammate?: 'full' | 'limited' | 'disabled';
      timeLimit?: number | null;
    } = {},
  ) {
    const simulation = await this.prisma.simulation.findUnique({
      where: { id: simulationId },
    });
    if (!simulation) throw new NotFoundException('Simulation not found');

    const inviteCode = nanoid(10);

    return this.prisma.assessment.create({
      data: {
        creatorId,
        simulationId,
        title: title || simulation.title,
        inviteCode,
        settings: settings as any,
      },
      include: {
        simulation: {
          select: { id: true, title: true, stack: true, difficulty: true, estimatedMinutes: true },
        },
      },
    });
  }

  async listByCreator(creatorId: string) {
    return this.prisma.assessment.findMany({
      where: { creatorId },
      include: {
        simulation: {
          select: { title: true, stack: true, difficulty: true, estimatedMinutes: true },
        },
        _count: { select: { candidates: true } },
        candidates: {
          select: { status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(assessmentId: string, creatorId: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        simulation: {
          select: { id: true, title: true, stack: true, difficulty: true, estimatedMinutes: true },
        },
        candidates: {
          include: {
            user: {
              select: { id: true, email: true, username: true },
            },
            session: {
              select: {
                id: true,
                status: true,
                currentTicketSeq: true,
                startedAt: true,
                lastActiveAt: true,
              },
            },
          },
          orderBy: { joinedAt: 'desc' },
        },
      },
    });

    if (!assessment) throw new NotFoundException('Assessment not found');
    if (assessment.creatorId !== creatorId) throw new ForbiddenException();

    // Fetch evaluations for completed candidates
    const candidatesWithScores = await Promise.all(
      assessment.candidates.map(async (candidate) => {
        let scores = null;

        if (candidate.session && candidate.status === 'COMPLETED') {
          const evaluations = await this.prisma.ticketEvaluation.findMany({
            where: { sessionId: candidate.session.id },
            select: { scores: true, usedReset: true },
          });

          if (evaluations.length > 0) {
            const avgOverall = Math.round(
              evaluations.reduce((sum, ev: any) => sum + (ev.scores?.overall || 0), 0) /
                evaluations.length,
            );
            scores = {
              overall: avgOverall,
              ticketsCompleted: evaluations.length,
              resetsUsed: evaluations.filter((ev) => ev.usedReset).length,
            };
          }
        }

        return { ...candidate, scores };
      }),
    );

    return { ...assessment, candidates: candidatesWithScores };
  }

  async getByInviteCode(inviteCode: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { inviteCode },
      include: {
        simulation: {
          select: { id: true, title: true, description: true, stack: true, difficulty: true, estimatedMinutes: true },
        },
        creator: {
          select: { username: true },
        },
      },
    });

    if (!assessment) throw new NotFoundException('Invalid invite code');
    if (assessment.status !== 'ACTIVE') throw new ForbiddenException('This assessment is no longer accepting candidates');

    return assessment;
  }

  async joinAssessment(inviteCode: string, userId: string) {
    const assessment = await this.getByInviteCode(inviteCode);

    // Check if already joined
    const existing = await this.prisma.assessmentCandidate.findUnique({
      where: {
        assessmentId_userId: {
          assessmentId: assessment.id,
          userId,
        },
      },
      include: { session: true },
    });

    if (existing) {
      return { candidate: existing, assessment, alreadyJoined: true };
    }

    // Start a workspace session for this candidate
    const session = await this.prisma.workspaceSession.create({
      data: {
        userId,
        simulationId: assessment.simulationId,
        status: 'ACTIVE',
        currentTicketSeq: 1,
      },
    });

    // Create candidate entry
    const candidate = await this.prisma.assessmentCandidate.create({
      data: {
        assessmentId: assessment.id,
        userId,
        sessionId: session.id,
        status: 'IN_PROGRESS',
        joinedAt: new Date(),
      },
    });

    return { candidate, assessment, session, alreadyJoined: false };
  }

  async markComplete(sessionId: string) {
    const candidate = await this.prisma.assessmentCandidate.findFirst({
      where: { sessionId },
    });

    if (candidate) {
      await this.prisma.assessmentCandidate.update({
        where: { id: candidate.id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });
    }
  }

  async closeAssessment(assessmentId: string, creatorId: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id: assessmentId },
    });

    if (!assessment) throw new NotFoundException('Assessment not found');
    if (assessment.creatorId !== creatorId) throw new ForbiddenException();

    return this.prisma.assessment.update({
      where: { id: assessmentId },
      data: { status: 'CLOSED' },
    });
  }
}