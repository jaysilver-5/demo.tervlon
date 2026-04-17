-- CreateTable
CREATE TABLE "ticket_evaluations" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "testResults" JSONB NOT NULL,
    "aiReview" JSONB NOT NULL,
    "scores" JSONB NOT NULL,
    "terminalOutput" TEXT NOT NULL,
    "usedReset" BOOLEAN NOT NULL DEFAULT false,
    "evaluationDuration" INTEGER NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_evaluations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ticket_evaluations" ADD CONSTRAINT "ticket_evaluations_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "workspace_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_evaluations" ADD CONSTRAINT "ticket_evaluations_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
