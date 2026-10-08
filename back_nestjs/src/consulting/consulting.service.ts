import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateConsultingDto } from './dto/create-consulting.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConsultingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  // AI 서버 연동 메서드
  private async getAiResponse(
    userId: string,
    question: string,
  ): Promise<string> {
    const fastapiUrl = this.configService.get<string>('FASTAPI_URL');

    // DB에서 해당 유저의 이전 상담 내역 조회
    const previousConsultings = await this.prisma.aiConsulting.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });

    // FastAPI가 받을 히스토리 형태로 변환
    const history = previousConsultings.flatMap((item) => [
      { role: 'user', content: item.question },
      { role: 'assistant', content: item.answer },
    ]);

    try {
      const response = await axios.post(`${fastapiUrl}/consult`, {
        question,
        history,
      });
      return response.data.answer;
    } catch (error: any) {
      console.error('FastAPI 통신 실패:', error.message);
      throw new InternalServerErrorException(
        'AI 응답을 불러오는 중 오류가 발생했습니다.',
      );
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  // AI 상담 생성
  async createConsulting(userId: string, dto: CreateConsultingDto) {
    const answer = await this.getAiResponse(userId, dto.question);

    return this.prisma.aiConsulting.create({
      data: {
        question: dto.question,
        answer,
        userId,
      },
    });
  }

  ///////////////////////////////////////////////////////////////////////////////////

  // 나의 AI 상담 전체 조회
  async getMyConsultings(userId: string) {
    return await this.prisma.aiConsulting.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        question: true,
        answer: true,
        createdAt: true,
      },
    });
  }

  ///////////////////////////////////////////////////////////////////////////////////

  // AI 상담 단건 상세 조회
  async getConsultingById(userId: string, id: string) {
    const consulting = await this.prisma.aiConsulting.findUnique({
      where: { id },
    });

    if (!consulting) {
      throw new NotFoundException('존재하지 않는 상담 내역입니다.');
    }

    if (consulting.userId !== userId) {
      throw new ForbiddenException('본인의 상담 내역만 조회할 수 있습니다.');
    }

    return consulting;
  }

  ///////////////////////////////////////////////////////////////////////////////////

  // AI 상담 내역 삭제
  async deleteConsulting(userId: string, id: string) {
    await this.getConsultingById(userId, id);

    await this.prisma.aiConsulting.delete({
      where: { id },
    });

    return { message: '상담 내역이 삭제되었습니다.' };
  }

  ///////////////////////////////////////////////////////////////////////////////////

  // 모든 상담 내역 삭제
  async deleteAllConsulting(userId: string) {
    await this.prisma.aiConsulting.deleteMany({
      where: { userId },
    });

    return { message: '모든 상담 내역이 삭제되었습니다.' };
  }
}
