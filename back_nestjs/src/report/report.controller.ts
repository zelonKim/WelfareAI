import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('report')
@UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // 신고하기
  @Post()
  async createReport(
    @GetUser('id') reporterId: string,
    @Body() dto: CreateReportDto,
  ) {
    return this.reportService.createReport(reporterId, dto);
  }

  // 신고 목록 조회 (관리자용) 
  @Get()
  async getReports(@Query('status') status?: ReportStatus) {
    return this.reportService.getReports(status);
  }

  // 신고 상세 조회 (관리자용) 
  @Get(':id')
  async getReportById(@Param('id') reportId: string) {
    return this.reportService.getReportById(reportId);
  }

  // 신고 상태 변경 (관리자용) 
  @Patch(':id/status')
  async updateReportStatus(
    @Param('id') reportId: string,
    @Body('status') status: ReportStatus,
  ) {
    return this.reportService.updateReportStatus(reportId, status);
  }
}
