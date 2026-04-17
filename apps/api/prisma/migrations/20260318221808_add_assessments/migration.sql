-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('ACTIVE', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('INVITED', 'IN_PROGRESS', 'COMPLETED', 'ABANDONED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'HIRING_MANAGER';
ALTER TYPE "Role" ADD VALUE 'CANDIDATE';

-- CreateTable
CREATE TABLE "assessments" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "simulationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "status" "AssessmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_candidates" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT,
    "status" "CandidateStatus" NOT NULL DEFAULT 'INVITED',
    "joinedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "assessment_candidates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assessments_inviteCode_key" ON "assessments"("inviteCode");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_candidates_sessionId_key" ON "assessment_candidates"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_candidates_assessmentId_userId_key" ON "assessment_candidates"("assessmentId", "userId");

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "simulations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_candidates" ADD CONSTRAINT "assessment_candidates_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_candidates" ADD CONSTRAINT "assessment_candidates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_candidates" ADD CONSTRAINT "assessment_candidates_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "workspace_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
