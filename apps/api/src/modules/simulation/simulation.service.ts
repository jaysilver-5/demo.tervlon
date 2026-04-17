import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SimulationService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.simulation.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        title: true,
        description: true,
        stack: true,
        difficulty: true,
        estimatedMinutes: true,
        _count: { select: { tickets: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const sim = await this.prisma.simulation.findUnique({
      where: { id },
      include: {
        tickets: { orderBy: { sequence: 'asc' } },
        triggers: true,
      },
    });

    if (!sim) throw new NotFoundException('Simulation not found');
    return sim;
  }
}