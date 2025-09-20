/*
  Warnings:

  - You are about to drop the `Analysis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Files` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Files" DROP CONSTRAINT "Files_diseaseid_fkey";

-- AlterTable
ALTER TABLE "public"."Disease" ADD COLUMN     "analysis" TEXT;

-- DropTable
DROP TABLE "public"."Analysis";

-- DropTable
DROP TABLE "public"."Files";
