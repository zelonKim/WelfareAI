/*
  Warnings:

  - You are about to drop the column `category` on the `AiConsulting` table. All the data in the column will be lost.
  - Made the column `address` on table `CrisisReport` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."AiConsulting" DROP COLUMN "category";

-- AlterTable
ALTER TABLE "public"."CrisisReport" ALTER COLUMN "address" SET NOT NULL;
