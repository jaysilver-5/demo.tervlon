import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

export type AiRole = 'pm' | 'teammate' | 'evaluator';

const MODEL_MAP: Record<AiRole, string> = {
  pm: 'claude-haiku-4-5-20251001',
  teammate: 'claude-sonnet-4-20250514',
  evaluator: 'claude-sonnet-4-20250514',
};

const DEFAULT_TOKENS: Record<AiRole, number> = {
  pm: 300,
  teammate: 500,
  evaluator: 2000,
};

@Injectable()
export class AiService {
  private client: Anthropic;

  constructor(private config: ConfigService) {
    this.client = new Anthropic({
      apiKey: this.config.get<string>('ANTHROPIC_API_KEY'),
    });
  }

  async chat(
    role: AiRole,
    systemPrompt: string,
    messages: { role: 'user' | 'assistant'; content: string }[],
    maxTokens?: number,
  ): Promise<string> {
    const response = await this.client.messages.create({
      model: MODEL_MAP[role],
      max_tokens: maxTokens || DEFAULT_TOKENS[role],
      system: systemPrompt,
      messages,
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    return textBlock ? textBlock.text : 'I couldn\'t generate a response.';
  }
}