import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service'; // 같은 user 폴더 안에 있다면!
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // auth 모듈 경로에 맞게 수정!
import { GetUser } from '../auth/decorators/get-user.decorator'; // 커스텀 데코레이터 경로에 맞게!
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import 'multer';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //1. 내 정보 조회
  @Get('me')
  getMe(@GetUser('id') userId: string) {
    return this.userService.getMe(userId);
  }

  // 2. 프로필 수정
  @Patch('profile')
  updateProfile(@GetUser('id') userId: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(userId, dto);
  }

  // 3. 회원 탈퇴
  @Delete('account')
  deleteAccount(@GetUser('id') userId: string) {
    return this.userService.deleteAccount(userId);
  }

  // 4. 이미지 업로드
  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @GetUser('id') userId: string,
  ) {
    if (!file) {
      throw new BadRequestException('업로드할 이미지 파일이 없습니다.');
    }

    const imageUrl = await this.userService.uploadImage(userId, file);

    return {
      success: true,
      imageUrl,
    };
  }

  // 5. 유저 푸시 토큰 저장
  @Patch('push-token')
  async updatePushToken(
    @GetUser('id') userId: string,
    @Body('pushToken') pushToken: string,
  ) {
    return this.userService.updatePushToken(userId, pushToken);
  }

  // 6. 유저 푸시 토큰 삭제
  @Delete('push-token')
  async deletePushToken(@GetUser('id') userId: string) {
    return await this.userService.deletePushToken(userId);
  }
}
