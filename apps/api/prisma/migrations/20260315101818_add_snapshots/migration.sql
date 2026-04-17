-- CreateEnum
CREATE TYPE "SnapshotType" AS ENUM ('AUTO_SAVE', 'SUBMISSION', 'CHECK_RUN', 'MANUAL');

-- CreateTable
CREATE TABLE "workspace_snapshots" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "snapshotType" "SnapshotType" NOT NULL,
    "fileTree" JSONB NOT NULL,
    "chatHistory" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workspace_snapshots_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "workspace_snapshots" ADD CONSTRAINT "workspace_snapshots_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "workspace_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
