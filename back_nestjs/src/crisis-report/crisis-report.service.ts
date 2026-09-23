import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCrisisReportDto } from './dto/create-crisis-report.dto';
import { UpdateCrisisReportDto } from './dto/update-crisis-report.dto';
import { CrisisStatus } from '@prisma/client';

@Injectable()
export class CrisisReportService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. 위기 제보 생성
  async createReport(userId: string, dto: CreateCrisisReportDto) {
    const report = await this.prisma.crisisReport.create({
      data: {
        userId,
        title: dto.title,
        content: dto.content,
        latitude: dto.latitude,
        longitude: dto.longitude,
        address: dto.address,
        images: dto.images || [],
      },
    });

    return {
      message: '위기 제보가 정상적으로 접수되었습니다.',
      report,
    };
  }

  ////////////////////////////////////////////////////////////////////////////////

  // 2. 전체 제보 목록 조회
  async getAllReports() {
    return this.prisma.crisisReport.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });
  }

  ////////////////////////////////////////////////////////////////////////////////

  // 3. 내가 작성한 제보 목록 조회
  async getMyReports(userId: string) {
    return this.prisma.crisisReport.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  ////////////////////////////////////////////////////////////////////////////////

  // 4. 제보 상세 조회
  async getReportById(reportId: string) {
    const report = await this.prisma.crisisReport.findUnique({
      where: { id: reportId },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundException('해당 제보 내역을 찾을 수 없습니다.');
    }

    return report;
  }

  ////////////////////////////////////////////////////////////////////////////////

  // 5. 제보 수정
  async updateReport(
    userId: string,
    reportId: string,
    dto: UpdateCrisisReportDto,
  ) {
    const report = await this.getReportById(reportId);

    // 본인이 작성한 제보인지 검증
    if (report.userId !== userId) {
      throw new ForbiddenException('본인의 제보 내역만 수정할 수 있습니다.');
    }

    const updatedReport = await this.prisma.crisisReport.update({
      where: { id: reportId },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.content && { content: dto.content }),
        ...(dto.latitude !== undefined && { latitude: dto.latitude }),
        ...(dto.longitude !== undefined && { longitude: dto.longitude }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.images && { images: dto.images }),
      },
    });

    return {
      message: '제보 정보가 성공적으로 수정되었습니다.',
      report: updatedReport,
    };
  }

  ////////////////////////////////////////////////////////////////////////////////

  // 6. 제보 삭제
  async deleteReport(userId: string, reportId: string) {
    const report = await this.getReportById(reportId);

    // 본인이 작성한 제보인지 검증
    if (report.userId !== userId) {
      throw new ForbiddenException('본인의 제보 내역만 삭제할 수 있습니다.');
    }

    await this.prisma.crisisReport.delete({
      where: { id: reportId },
    });

    return {
      message: '제보 내역이 성공적으로 삭제되었습니다.',
    };
  }

  ////////////////////////////////////////////////////////////////////////////////

  async updateReportStatus(reportId: string, status: CrisisStatus) {
    const report = await this.getReportById(reportId);

    if (!report) {
      throw new NotFoundException('해당 제보 내역을 찾을 수 없습니다.');
    }

    return this.prisma.crisisReport.update({
      where: { id: reportId },
      data: { status },
    });
  }
}
