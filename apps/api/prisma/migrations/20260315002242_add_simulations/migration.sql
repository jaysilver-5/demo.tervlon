-- CreateEnum
CREATE TYPE "Stack" AS ENUM ('NODE_EXPRESS_PRISMA');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "SimStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'ABANDONED');

-- CreateTable
CREATE TABLE "simulations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "stack" "Stack" NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL,
    "starterRepoUrl" TEXT NOT NULL DEFAULT '',
    "starterRepoRef" TEXT NOT NULL DEFAULT '',
    "evaluationWeights" JSONB NOT NULL DEFAULT '{}',
    "status" "SimStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "simulationId" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "brief" TEXT NOT NULL,
    "testFiles" TEXT[],
    "evaluationCriteria" JSONB NOT NULL DEFAULT '{}',
    "estimatedMinutes" INTEGER NOT NULL,
    "referenceImpl" TEXT,
    "minimumPassRate" DOUBLE PRECISION NOT NULL DEFAULT 0.6,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "triggers" (
    "id" TEXT NOT NULL,
    "simulationId" TEXT NOT NULL,
    "condition" JSONB NOT NULL,
    "effect" JSONB NOT NULL,
    "pmMessage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "triggers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "simulationId" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentTicketSeq" INTEGER NOT NULL DEFAULT 1,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workspace_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tickets_simulationId_sequence_key" ON "tickets"("simulationId", "sequence");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_sessions_userId_simulationId_key" ON "workspace_sessions"("userId", "simulationId");

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "simulations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triggers" ADD CONSTRAINT "triggers_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "simulations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_sessions" ADD CONSTRAINT "workspace_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_sessions" ADD CONSTRAINT "workspace_sessions_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "simulations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
