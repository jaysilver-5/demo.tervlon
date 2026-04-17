import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('workspace')
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @Post('sessions')
  async startSession(
    @CurrentUser() user: { id: string },
    @Body() body: { simulationId: string },
  ) {
    return this.workspaceService.startSession(user.id, body.simulationId);
  }

  @Get('sessions/:id')
  async getSession(@Param('id') id: string) {
    return this.workspaceService.getSession(id);
  }

  @Get('sessions/by-sim/:simulationId')
  async getUserSession(
    @CurrentUser() user: { id: string },
    @Param('simulationId') simulationId: string,
  ) {
    return this.workspaceService.getUserSession(user.id, simulationId);
  }

  @Get('sessions/:id/files')
  async getStarterFiles(@Param('id') id: string) {
    return this.workspaceService.getStarterFiles(id);
  }

@Post('sessions/:id/snapshots')
  async saveSnapshot(
    @Param('id') id: string,
    @Body()
    body: {
      snapshotType: 'AUTO_SAVE' | 'SUBMISSION' | 'CHECK_RUN' | 'MANUAL';
      fileTree: Record<string, string>;
      chatHistory: object[];
    },
  ) {
    return this.workspaceService.saveSnapshot(
      id,
      body.snapshotType,
      body.fileTree,
      body.chatHistory,
    );
  }

  @Get('sessions/:id/snapshots/latest')
  async getLatestSnapshot(@Param('id') id: string) {
    return this.workspaceService.getLatestSnapshot(id);
  }
}