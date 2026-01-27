/*
  Warnings:

  - The values [processing] on the enum `ModerationStatus` will be removed. If these variants are still used in the database, this will fail.
  - The `status` column on the `QuestionSubmission` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[generatedQuestionId]` on the table `QuestionSubmission` will be added. If there are existing duplicate values, this will fail.
*/

-- 1) Create new enum for submissions
CREATE TYPE "SubmissionStatus" AS ENUM ('pending', 'processing', 'accepted', 'rejected');

-- 2) Alter QuestionSubmission first so it no longer depends on ModerationStatus
ALTER TABLE "QuestionSubmission"
  ADD COLUMN "generatedQuestionId" TEXT;

ALTER TABLE "QuestionSubmission"
  DROP COLUMN "status";

ALTER TABLE "QuestionSubmission"
  ADD COLUMN "status" "SubmissionStatus" NOT NULL DEFAULT 'pending';

-- 3) Now we can safely alter ModerationStatus (remove 'processing') and update Question.status
BEGIN;

CREATE TYPE "ModerationStatus_new" AS ENUM ('approved', 'pending', 'rejected');

ALTER TABLE "public"."Question"
  ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Question"
  ALTER COLUMN "status" TYPE "ModerationStatus_new"
  USING ("status"::text::"ModerationStatus_new");

ALTER TYPE "ModerationStatus" RENAME TO "ModerationStatus_old";
ALTER TYPE "ModerationStatus_new" RENAME TO "ModerationStatus";

DROP TYPE "public"."ModerationStatus_old";

ALTER TABLE "public"."Question"
  ALTER COLUMN "status" SET DEFAULT 'pending';

COMMIT;

-- 4) Index + FK for generatedQuestionId
CREATE UNIQUE INDEX "QuestionSubmission_generatedQuestionId_key"
  ON "QuestionSubmission"("generatedQuestionId");

ALTER TABLE "QuestionSubmission"
  ADD CONSTRAINT "QuestionSubmission_generatedQuestionId_fkey"
  FOREIGN KEY ("generatedQuestionId")
  REFERENCES "Question"("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;
