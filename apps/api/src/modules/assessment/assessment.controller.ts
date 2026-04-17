import { Controller, Post, Get, Param, Body, Patch } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('assessments')
export class AssessmentController {
  constructor(private assessmentService: AssessmentService) {}

  @Post()
  async create(
    @CurrentUser() user: { id: string },
    @Body()
    body: {
      simulationId: string;
      title?: string;
      settings?: {
        aiTeammate?: 'full' | 'limited' | 'disabled';
        timeLimit?: number | null;
      };
    },
  ) {
    return this.assessmentService.create(
      user.id,
      body.simulationId,
      body.title || '',
      body.settings,
    );
  }

  @Get()
  async list(@CurrentUser() user: { id: string }) {
    return this.assessmentService.listByCreator(user.id);
  }

  @Get(':id')
  async getById(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.assessmentService.getById(id, user.id);
  }

  @Public()
  @Get('invite/:code')
  async getByInviteCode(@Param('code') code: string) {
    return this.assessmentService.getByInviteCode(code);
  }

  @Post('invite/:code/join')
  async join(
    @Param('code') code: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.assessmentService.joinAssessment(code, user.id);
  }

  @Patch(':id/close')
  async close(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.assessmentService.closeAssessment(id, user.id);
  }
}