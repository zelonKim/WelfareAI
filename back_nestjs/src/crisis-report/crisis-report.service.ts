import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCrisisReportDto } from './dto/create-crisis-report.dto';
import { UpdateCrisisReportDto } from './dto/update-crisis-report.dto';
import { CrisisStatus } from '@prisma/client';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class CrisisReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

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
            profileImage: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            user: {
              select: {
                id: true,
                nickname: true,
                profileImage: true,
              },
            },
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

  /////////////////////////////////////////////////////////////////////////////////

  async createComment(
    reportId: string,
    userId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const { content } = createCommentDto;

    // 1. 해당 위기 제보글이 존재하는지 먼저 확인
    const reportExists = await this.prisma.crisisReport.findUnique({
      where: { id: reportId },
      select: { id: true, userId: true },
    });

    if (!reportExists) {
      throw new NotFoundException('존재하지 않거나 삭제된 제보글입니다.');
    }

    try {
      // 2. 댓글 생성 (Prisma)
      const newComment = await this.prisma.crisisComment.create({
        data: {
          content,
          reportId,
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              nickname: true,
              profileImage: true,
            },
          },
        },
      });

      // 자기가 자기 글에 쓴 댓글이 아닌 경우에만 알림 전송
      if (reportExists.userId !== userId) {
        this.notificationService
          .sendPushNotification({
            targetUserId: reportExists.userId,
            title: `${newComment.user.nickname}님의 댓글`,
            body: content,
            data: { url: `/crisisReportDetail/${reportId}`, id: reportId }, // 클릭 시 해당 제보 상세 페이지로 이동할 데이터
          })
          .catch((err) => console.error('푸시 알림 전송 실패:', err));
      }
      return newComment;
    } catch (error) {
      console.log('댓글 등록 중 오류 발생:', error);
      throw new InternalServerErrorException(
        '댓글 등록 중 오류가 발생했습니다.',
      );
    }
  }

  ////////////////////////////////////////////////////////////////////

  async deleteComment(userId: string, commentId: string) {
    const comment = await this.prisma.crisisComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    // 2. 작성자 본인 확인
    if (comment.userId !== userId) {
      throw new ForbiddenException('자신의 댓글만 삭제할 수 있습니다.');
    }

    // 3. 댓글 삭제
    await this.prisma.crisisComment.delete({
      where: { id: commentId },
    });

    return { message: '댓글이 성공적으로 삭제되었습니다.' };
  }
}
