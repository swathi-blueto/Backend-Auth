/*
  Warnings:

  - A unique constraint covering the columns `[admissionNumber]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[admissionNumber,name]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `admissionNumber` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "students" ADD COLUMN     "admissionNumber" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';

-- CreateIndex
CREATE UNIQUE INDEX "students_admissionNumber_key" ON "students"("admissionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "students_admissionNumber_name_key" ON "students"("admissionNumber", "name");
