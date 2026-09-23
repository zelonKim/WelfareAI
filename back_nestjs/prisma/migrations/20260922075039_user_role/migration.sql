-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'STAFF', 'ADMIN');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "public"."WelfarePlace" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."WelfarePlace" ADD CONSTRAINT "WelfarePlace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
