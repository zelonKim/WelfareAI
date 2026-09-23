/*
  Warnings:

  - You are about to drop the column `facilityId` on the `MapBookmark` table. All the data in the column will be lost.
  - You are about to drop the `WelfareFacility` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,placeId]` on the table `MapBookmark` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `placeId` to the `MapBookmark` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."MapBookmark" DROP CONSTRAINT "MapBookmark_facilityId_fkey";

-- DropIndex
DROP INDEX "public"."MapBookmark_userId_facilityId_key";

-- AlterTable
ALTER TABLE "public"."MapBookmark" DROP COLUMN "facilityId",
ADD COLUMN     "placeId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."WelfareFacility";

-- CreateTable
CREATE TABLE "public"."WelfarePlace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "phone" TEXT,
    "description" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WelfarePlace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WelfarePlace_latitude_longitude_idx" ON "public"."WelfarePlace"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "MapBookmark_userId_placeId_key" ON "public"."MapBookmark"("userId", "placeId");

-- AddForeignKey
ALTER TABLE "public"."MapBookmark" ADD CONSTRAINT "MapBookmark_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "public"."WelfarePlace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
