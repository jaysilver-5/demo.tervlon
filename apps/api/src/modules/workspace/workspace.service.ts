import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ECOMMERCE_STARTER_FILES } from './starter-files';

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}

  async startSession(userId: string, simulationId: string) {
    const existing = await this.prisma.workspaceSession.findUnique({
      where: {
        userId_simulationId: { userId, simulationId },
      },
    });

    if (existing) {
      return this.prisma.workspaceSession.update({
        where: { id: existing.id },
        data: {
          status: 'ACTIVE',
          lastActiveAt: new Date(),
        },
        include: {
          simulation: {
            include: {
              tickets: { orderBy: { sequence: 'asc' } },
            },
          },
        },
      });
    }

    const sim = await this.prisma.simulation.findUnique({
      where: { id: simulationId },
    });
    if (!sim) throw new NotFoundException('Simulation not found');

    return this.prisma.workspaceSession.create({
      data: {
        userId,
        simulationId,
        status: 'ACTIVE',
        currentTicketSeq: 1,
      },
      include: {
        simulation: {
          include: {
            tickets: { orderBy: { sequence: 'asc' } },
          },
        },
      },
    });
  }

  async getSession(sessionId: string) {
    const session = await this.prisma.workspaceSession.findUnique({
      where: { id: sessionId },
      include: {
        simulation: {
          include: {
            tickets: { orderBy: { sequence: 'asc' } },
          },
        },
      },
    });

    if (!session) throw new NotFoundException('Session not found');
    return session;
  }

  async getUserSession(userId: string, simulationId: string) {
    return this.prisma.workspaceSession.findUnique({
      where: {
        userId_simulationId: { userId, simulationId },
      },
      include: {
        simulation: {
          include: {
            tickets: { orderBy: { sequence: 'asc' } },
          },
        },
      },
    });
  }

  async getStarterFiles(sessionId: string) {
    const session = await this.getSession(sessionId);

    // Check if there's an existing snapshot to restore from
    const latestSnapshot = await this.prisma.workspaceSnapshot.findFirst({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
    });

    if (latestSnapshot) {
      return {
        files: latestSnapshot.fileTree,
        chatHistory: latestSnapshot.chatHistory,
        restoredFrom: 'snapshot',
      };
    }

    // No snapshot — return starter files
    // For MVP, we only have one simulation's starter files
    // In the future, this would clone from the simulation's starterRepoUrl
    return {
      files: ECOMMERCE_STARTER_FILES,
      chatHistory: [],
      restoredFrom: 'starter',
    };
  }

  async saveSnapshot(
    sessionId: string,
    snapshotType: 'AUTO_SAVE' | 'SUBMISSION' | 'CHECK_RUN' | 'MANUAL',
    fileTree: Record<string, string>,
    chatHistory: object[],
  ) {
    await this.prisma.workspaceSession.update({
      where: { id: sessionId },
      data: { lastActiveAt: new Date() },
    });

    return this.prisma.workspaceSnapshot.create({
      data: {
        sessionId,
        snapshotType,
        fileTree,
        chatHistory: chatHistory as any,
      },
    });
  }

  async getLatestSnapshot(sessionId: string) {
    return this.prisma.workspaceSnapshot.findFirst({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
    });
  }
}