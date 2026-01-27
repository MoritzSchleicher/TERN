-- AlterEnum
ALTER TYPE "ModerationStatus" ADD VALUE 'processing';

-- AlterTable
ALTER TABLE "QuestionSubmission" ADD COLUMN     "rejectReason" TEXT;
