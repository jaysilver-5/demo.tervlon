import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post(':sessionId/message')
  async sendMessage(
    @Param('sessionId') sessionId: string,
    @Body() body: { text: string; agent: 'pm' | 'teammate' },
  ) {
    return this.chatService.sendMessage(sessionId, body.text, body.agent);
  }

  @Post(':sessionId/welcome')
  async getWelcome(@Param('sessionId') sessionId: string) {
    return this.chatService.getWelcomeMessage(sessionId);
  }

  @Get(':sessionId/history')
  async getHistory(@Param('sessionId') sessionId: string) {
    return this.chatService.getHistory(sessionId);
  }
}