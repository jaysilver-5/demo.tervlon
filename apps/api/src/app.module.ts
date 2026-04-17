import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SimulationModule } from './modules/simulation/simulation.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { AiModule } from './modules/ai/ai.module';
import { ChatModule } from './modules/chat/chat.module';
import { EvaluationModule } from './modules/evaluation/evaluation.module';
import { AssessmentModule } from './modules/assessment/assessment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    SimulationModule,
    WorkspaceModule,
    AiModule,
    ChatModule,
    EvaluationModule,
    AssessmentModule
  ],
})
export class AppModule {}