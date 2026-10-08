import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class BlockService {
  constructor(private readonly prisma: PrismaService) {}

  async getBlockedUsers(blockerId: string) {
    return await this.prisma.block.findMany({
      where: {
        blockerId,
      },
      select: {
        id: true, 
        blockedId: true, 
        createdAt: true,
        blockedUser: {
          select: {
            id: true,
            nickname: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  ////////////////////////////////////////////////////////////////////////

  async blockUser(blockerId: string, blockedUserName: string) {
    const targetUser = await this.prisma.user.findFirst({
      where: { nickname: blockedUserName },
    });

    if (!targetUser) {
      throw new NotFoundException('차단할 유저를 찾을 수 없습니다.');
    }

    if (blockerId === targetUser.id) {
      throw new BadRequestException('자기 자신을 차단할 수 없습니다.');
    }

    try {
      return await this.prisma.block.create({
        data: {
          blockerId,
          blockedId: targetUser.id,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('이미 차단한 유저입니다.');
      }
      throw error;
    }
  }

  ////////////////////////////////////////////////////////////////////////

  async unblockUser(blockerId: string, blockedId: string) {
    const blockRecord = await this.prisma.block.findFirst({
      where: {
        blockerId,
        blockedId,
      },
    });

    if (!blockRecord) {
      throw new NotFoundException(
        '차단 목록에서 해당 유저를 찾을 수 없습니다.',
      );
    }

    await this.prisma.block.deleteMany({
      where: {
        blockerId,
        blockedId,
      },
    });

    return { message: '차단이 해제되었습니다.' };
  }
}
