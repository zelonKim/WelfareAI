import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CrisisReportService } from './crisis-report.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CreateCrisisReportDto } from './dto/create-crisis-report.dto';
import { UpdateCrisisReportDto } from './dto/update-crisis-report.dto';
import { UpdateCrisisStatusDto } from './dto/update-crisis-status.dto';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('crisis-report')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CrisisReportController {
  constructor(private readonly crisisReportService: CrisisReportService) {}

  @Post()
  async createReport(
    @GetUser('id') userId: string,
    @Body() dto: CreateCrisisReportDto,
  ) {
    return this.crisisReportService.createReport(userId, dto);
  }

  @Get()
  async getAllReports() {
    return this.crisisReportService.getAllReports();
  }

  @Get('me')
  async getMyReports(@GetUser('id') userId: string) {
    return this.crisisReportService.getMyReports(userId);
  }

  @Get(':id')
  async getReportById(@Param('id') reportId: string) {
    return this.crisisReportService.getReportById(reportId);
  }

  @Patch(':id')
  async updateReport(
    @GetUser('id') userId: string,
    @Param('id') reportId: string,
    @Body() dto: UpdateCrisisReportDto,
  ) {
    return this.crisisReportService.updateReport(userId, reportId, dto);
  }

  @Delete(':id')
  async deleteReport(
    @GetUser('id') userId: string,
    @Param('id') reportId: string,
  ) {
    return this.crisisReportService.deleteReport(userId, reportId);
  }

  @Patch(':id/status')
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  async updateReportStatus(
    @Param('id') reportId: string,
    @Body() dto: UpdateCrisisStatusDto,
  ) {
    return this.crisisReportService.updateReportStatus(reportId, dto.status);
  }

  @Post(':id/comment')
  async createComment(
    @Param('id') reportId: string,
    @GetUser('id') userId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.crisisReportService.createComment(
      reportId,
      userId,
      createCommentDto,
    );
  }
}
