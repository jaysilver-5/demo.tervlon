import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';

@Controller('evaluate')
export class EvaluationController {
  constructor(private evaluationService: EvaluationService) {}

  @Post(':sessionId/check')
  async evaluate(@Param('sessionId') sessionId: string) {
    return this.evaluationService.evaluate(sessionId);
  }

  @Post(':sessionId/submit')
  async submit(@Param('sessionId') sessionId: string) {
    return this.evaluationService.submit(sessionId);
  }

  @Post(':sessionId/reset/:ticketSeq')
  async reset(
    @Param('sessionId') sessionId: string,
    @Param('ticketSeq') ticketSeq: string,
  ) {
    return this.evaluationService.reset(sessionId, parseInt(ticketSeq, 10));
  }

  @Get(':sessionId/report')
  async getReport(@Param('sessionId') sessionId: string) {
    return this.evaluationService.getReport(sessionId);
  }
}