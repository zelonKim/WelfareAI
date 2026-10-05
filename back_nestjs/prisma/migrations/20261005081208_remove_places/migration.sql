/*
  Warnings:

  - You are about to drop the `MapBookmark` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PolicyBookmark` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WelfarePlace` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WelfarePolicy` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."MapBookmark" DROP CONSTRAINT "MapBookmark_placeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MapBookmark" DROP CONSTRAINT "MapBookmark_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PolicyBookmark" DROP CONSTRAINT "PolicyBookmark_policyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PolicyBookmark" DROP CONSTRAINT "PolicyBookmark_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WelfarePlace" DROP CONSTRAINT "WelfarePlace_userId_fkey";

-- DropTable
DROP TABLE "public"."MapBookmark";

-- DropTable
DROP TABLE "public"."PolicyBookmark";

-- DropTable
DROP TABLE "public"."WelfarePlace";

-- DropTable
DROP TABLE "public"."WelfarePolicy";
