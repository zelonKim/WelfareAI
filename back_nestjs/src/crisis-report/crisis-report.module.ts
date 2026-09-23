import { Module } from '@nestjs/common';
import { CrisisReportController } from './crisis-report.controller';
import { CrisisReportService } from './crisis-report.service';

@Module({
  controllers: [CrisisReportController],
  providers: [CrisisReportService],
})
export class CrisisReportModule {}
