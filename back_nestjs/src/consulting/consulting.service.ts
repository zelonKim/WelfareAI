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

  // FastAPI 등 AI 서버 연동 메서드
  private async getAiResponse(question: string): Promise<string> {
    const fastapiUrl = this.configService.get<string>('FASTAPI_URL');

    try {
      const response = await axios.post(`${fastapiUrl}/consult`, {
        question,
      });
      return response.data.answer;
    } catch (error: any) {
      console.error('FastAPI 통신 실패:', error.message);
      throw new InternalServerErrorException(
        'AI 응답을 불러오는 중 오류가 발생했습니다.',
      );
    }
  }

  // 1. AI 상담 생성
  async createConsulting(userId: string, dto: CreateConsultingDto) {
    const answer = await this.getAiResponse(dto.question);

    return this.prisma.aiConsulting.create({
      data: {
        question: dto.question,
        answer,
        userId,
      },
    });
  }

  ///////////////////////////////////////////////////////////////////////////////////

  // 2. 내 AI 상담 전체 조회
  async getMyConsultings(userId: string) {
    return this.prisma.aiConsulting.findMany({
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

  // 3. AI 상담 단건 상세 조회
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

  // 4. AI 상담 내역 삭제
  async deleteConsulting(userId: string, id: string) {
    await this.getConsultingById(userId, id);

    await this.prisma.aiConsulting.delete({
      where: { id },
    });

    return { message: '상담 내역이 삭제되었습니다.' };
  }
}
