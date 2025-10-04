-- CreateEnum
CREATE TYPE "Category" AS ENUM ('history', 'geography', 'culture', 'nature');

-- CreateEnum
CREATE TYPE "CreatedBy" AS ENUM ('system', 'user');

-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('approved', 'pending', 'rejected');

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "question" TEXT NOT NULL,
    "answers" TEXT[],
    "correctIndex" INTEGER NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "country" TEXT NOT NULL,
    "fact" TEXT NOT NULL,
    "createdBy" "CreatedBy" NOT NULL DEFAULT 'system',
    "createdByUserId" TEXT,
    "status" "ModerationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Question_category_idx" ON "Question"("category");

-- CreateIndex
CREATE INDEX "Question_status_idx" ON "Question"("status");

-- CreateIndex
CREATE INDEX "Question_country_idx" ON "Question"("country");

-- CreateIndex
CREATE INDEX "Question_createdAt_idx" ON "Question"("createdAt");

-- CreateIndex
CREATE INDEX "Question_question_idx" ON "Question"("question");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
