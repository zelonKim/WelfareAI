import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportStatus } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  // 신고하기
  async createReport(reporterId: string, dto: CreateReportDto) {
    const { reportedUserName, reason, details } = dto;

    const targetUser = await this.prisma.user.findFirst({
      where: {
        nickname: reportedUserName,
      },
    });

    if (!targetUser) {
      throw new NotFoundException('신고 대상 유저를 찾을 수 없습니다.');
    }

    const reportedUserId = targetUser.id;

    if (reporterId === reportedUserId) {
      throw new BadRequestException('자기 자신을 신고할 수 없습니다.');
    }

    try {
      const newReport = await this.prisma.report.create({
        data: {
          reporterId,
          reportedUserId,
          reason,
          details,
        },
      });

      return {
        message: '신고가 정상적으로 접수되었습니다.',
        reportId: newReport.id,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          '이미 동일한 사유로 신고를 접수한 내역이 존재합니다.',
        );
      }
      throw error;
    }
  }

  ////////////////////////////////////////////////////////////////////////

  // 전체 신고 목록 조회 (관리자용)
  async getReports(status?: ReportStatus) {
    return await this.prisma.report.findMany({
      where: status ? { status } : undefined,
      include: {
        reporter: {
          select: {
            id: true,
            nickname: true,
            email: true,
            profileImage: true,
          },
        },
        reportedUser: {
          select: {
            id: true,
            nickname: true,
            email: true,
            profileImage: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  ////////////////////////////////////////////////////////////////////////

  // 신고 단건 상세 조회 (관리자용)
  async getReportById(reportId: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      include: {
        reporter: {
          select: { id: true, nickname: true, email: true },
        },
        reportedUser: {
          select: { id: true, nickname: true, email: true },
        },
      },
    });

    if (!report) {
      throw new NotFoundException('해당 신고 내역을 찾을 수 없습니다.');
    }

    return report;
  }

  ////////////////////////////////////////////////////////////////////////

  //  신고 처리 상태 업데이트 (관리자용)
  async updateReportStatus(reportId: string, status: ReportStatus) {
    await this.getReportById(reportId);

    return this.prisma.report.update({
      where: { id: reportId },
      data: { status },
    });
  }
}
