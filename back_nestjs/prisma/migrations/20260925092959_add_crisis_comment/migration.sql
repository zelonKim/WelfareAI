-- CreateTable
CREATE TABLE "public"."CrisisComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrisisComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CrisisComment_reportId_idx" ON "public"."CrisisComment"("reportId");

-- CreateIndex
CREATE INDEX "CrisisComment_userId_idx" ON "public"."CrisisComment"("userId");

-- AddForeignKey
ALTER TABLE "public"."CrisisComment" ADD CONSTRAINT "CrisisComment_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "public"."CrisisReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CrisisComment" ADD CONSTRAINT "CrisisComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
