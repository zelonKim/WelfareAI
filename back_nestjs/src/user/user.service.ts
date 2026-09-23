import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import type { Express } from 'express';
import 'multer';
import { R2_CLIENT } from 'utils/r2.provider';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(R2_CLIENT) private readonly s3Client: S3Client,
  ) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        profileImage: true,
        bio: true,
        termsAgreedAt: true,
        privacyAgreedAt: true,
        marketingAgreedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }

    return user;
  }

  ////////////////////////////////////

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const {
      nickname,
      termsAgreedAt,
      privacyAgreedAt,
      marketingAgreedAt,
      ...profileData
    } = dto;

    const trimmedNickname = nickname?.trim();

    if (trimmedNickname) {
      if (trimmedNickname.length < 2) {
        throw new BadRequestException('닉네임은 최소 2글자 이상이어야 합니다.');
      }

      if (trimmedNickname.length > 12) {
        throw new BadRequestException(
          '닉네임은 최대 12글자 이하이어야 합니다.',
        );
      }

      const existingUser = await this.prisma.user.findFirst({
        where: {
          nickname: trimmedNickname,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw new ConflictException('이미 사용 중인 닉네임입니다.');
      }

      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(nickname && { nickname }),
          ...profileData,
          // 문자열로 넘어온 날짜를 Date 객체로 변환하여 저장
          ...(termsAgreedAt && { termsAgreedAt: new Date(termsAgreedAt) }),
          ...(privacyAgreedAt && {
            privacyAgreedAt: new Date(privacyAgreedAt),
          }),
          ...(marketingAgreedAt && {
            marketingAgreedAt: new Date(marketingAgreedAt),
          }),
        },
        select: {
          email: true,
          nickname: true,
          profileImage: true,
          bio: true,
          termsAgreedAt: true,
          privacyAgreedAt: true,
          marketingAgreedAt: true,
        },
      });
    }
  }
  ////////////////////////////////////

  async deleteAccount(userId: string) {
    await this.prisma.user.delete({
      where: { id: userId },
    });
    return { message: '회원 탈퇴가 완료되었습니다.' };
  }

  ////////////////////////////////////

  async uploadProfileImage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const fileExtension = file.originalname.split('.').pop() || 'jpg';
    const fileName = `profiles/${userId}-${Date.now()}.${fileExtension}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      return `${process.env.R2_PUBLIC_URL}/${fileName}`;
    } catch (error) {
      console.error('R2 Upload Error:', error);
      throw new InternalServerErrorException(
        '프로필 이미지 업로드 중 오류가 발생했습니다.',
      );
    }
  }

  /////////////////////////////////////////

  async updatePushToken(userId: string, pushToken: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { pushToken },
    });
  }

  /////////////////////////////////////////

  async deletePushToken(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        pushToken: null,
      },
    });

    return { message: '푸시 토큰이 성공적으로 삭제되었습니다.' };
  }
}
