/*
  Warnings:

  - Added the required column `name` to the `Disease` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Disease` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Disease" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
