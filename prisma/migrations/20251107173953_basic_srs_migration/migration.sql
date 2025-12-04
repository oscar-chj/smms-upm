/*
  Warnings:

  - A unique constraint covering the columns `[studentId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emailVerified` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('UNIVERSITY', 'FACULTY', 'COLLEGE', 'CLUB');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('REGISTERED', 'WAITLISTED', 'CANCELLED', 'ATTENDED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "enrollmentDate" TIMESTAMP(3),
ADD COLUMN     "faculty" TEXT,
ADD COLUMN     "program" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
ADD COLUMN     "studentId" TEXT,
ADD COLUMN     "totalMeritPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "year" INTEGER,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "emailVerified" SET NOT NULL,
ALTER COLUMN "emailVerified" SET DEFAULT false;

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,
    "category" "EventCategory" NOT NULL,
    "points" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "registeredCount" INTEGER NOT NULL DEFAULT 0,
    "status" "EventStatus" NOT NULL DEFAULT 'UPCOMING',
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRegistration" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'REGISTERED',
    "attendanceMarked" BOOLEAN NOT NULL DEFAULT false,
    "pointsAwarded" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeritRecord" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "eventId" TEXT,
    "category" "EventCategory" NOT NULL,
    "points" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "meritType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeritRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_category_idx" ON "Event"("category");

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "Event"("status");

-- CreateIndex
CREATE INDEX "Event_date_idx" ON "Event"("date");

-- CreateIndex
CREATE INDEX "EventRegistration_studentId_idx" ON "EventRegistration"("studentId");

-- CreateIndex
CREATE INDEX "EventRegistration_eventId_idx" ON "EventRegistration"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "EventRegistration_eventId_studentId_key" ON "EventRegistration"("eventId", "studentId");

-- CreateIndex
CREATE INDEX "MeritRecord_studentId_idx" ON "MeritRecord"("studentId");

-- CreateIndex
CREATE INDEX "MeritRecord_eventId_idx" ON "MeritRecord"("eventId");

-- CreateIndex
CREATE INDEX "MeritRecord_category_idx" ON "MeritRecord"("category");

-- CreateIndex
CREATE INDEX "MeritRecord_date_idx" ON "MeritRecord"("date");

-- CreateIndex
CREATE UNIQUE INDEX "User_studentId_key" ON "User"("studentId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_studentId_idx" ON "User"("studentId");

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeritRecord" ADD CONSTRAINT "MeritRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeritRecord" ADD CONSTRAINT "MeritRecord_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
