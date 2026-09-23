import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { SearchPolicyDto } from './dto/search-policy.dto';

@Injectable()
export class PolicyService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. 정책 생성
  async createPolicy(dto: CreatePolicyDto) {
    return this.prisma.welfarePolicy.create({
      data: dto,
    });
  }

  // 2. 정책 목록 및 검색 조회
  async getPolicies(dto: SearchPolicyDto) {
    const { keyword } = dto;

    const where: any = {};

    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { content: { contains: keyword, mode: 'insensitive' } },
        { summary: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    return this.prisma.welfarePolicy.findMany({
      where,
      take: 100,
      orderBy: { createdAt: 'desc' },
    });
  }

  // 3. 정책 단건 상세 조회
  async getPolicyById(id: string) {
    const policy = await this.prisma.welfarePolicy.findUnique({
      where: { id },
      include: {
        _count: {
          select: { bookmarks: true },
        },
      },
    });

    if (!policy) {
      throw new NotFoundException('존재하지 않는 복지 정책입니다.');
    }

    return policy;
  }

  // 4. 정책 수정
  async updatePolicy(id: string, dto: UpdatePolicyDto) {
    await this.getPolicyById(id);

    return this.prisma.welfarePolicy.update({
      where: { id },
      data: dto,
    });
  }

  // 5. 정책 삭제
  async deletePolicy(id: string) {
    await this.getPolicyById(id);

    await this.prisma.welfarePolicy.delete({
      where: { id },
    });

    return { message: '복지 정책이 성공적으로 삭제되었습니다.' };
  }
}
