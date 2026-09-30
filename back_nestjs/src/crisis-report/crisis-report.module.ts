import { Module } from '@nestjs/common';
import { CrisisReportController } from './crisis-report.controller';
import { CrisisReportService } from './crisis-report.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [CrisisReportController],
  providers: [CrisisReportService],
})
export class CrisisReportModule {}
