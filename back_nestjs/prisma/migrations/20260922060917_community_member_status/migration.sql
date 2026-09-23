-- CreateEnum
CREATE TYPE "public"."CommunityMemberStatus" AS ENUM ('PENDING', 'APPROVED', 'BANNED');

-- AlterTable
ALTER TABLE "public"."CommunityMember" ADD COLUMN     "status" "public"."CommunityMemberStatus" NOT NULL DEFAULT 'PENDING';
