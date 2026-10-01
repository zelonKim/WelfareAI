import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CreateCommunityPostDto } from './dto/create-community.dto';
import { UpdateCommunityPostDto } from './dto/update-community.dto';

import { UpdateMemberStatusDto } from './dto/update-member-status.dto';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  // 모임 생성
  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(
    @GetUser('id') hostId: string,
    @Body() dto: CreateCommunityPostDto,
  ) {
    return this.communityService.createPost(hostId, dto);
  }

  // 모임 전체 조회
  @Get()
  async getAllPosts() {
    return this.communityService.getAllPosts();
  }

  // 나의 모임 조회
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyPosts(@GetUser('id') userId: string) {
    return await this.communityService.getMyPosts(userId);
  }

  // 모임 단일 조회
  @Get(':id')
  async getPostById(@Param('id') postId: string) {
    return this.communityService.getPostById(postId);
  }

  //  모임 변경
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updatePost(
    @GetUser('id') hostId: string,
    @Param('id') postId: string,
    @Body() dto: UpdateCommunityPostDto,
  ) {
    return this.communityService.updatePost(hostId, postId, dto);
  }

  // 모임 삭제
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePost(@GetUser('id') hostId: string, @Param('id') postId: string) {
    return this.communityService.deletePost(hostId, postId);
  }

  // 참여 신청
  @UseGuards(JwtAuthGuard)
  @Post(':id/apply')
  async applyCommunity(
    @GetUser('id') userId: string,
    @Param('id') postId: string,
  ) {
    return this.communityService.applyCommunity(userId, postId);
  }

  // 모임 나가기
  @UseGuards(JwtAuthGuard)
  @Delete(':id/leave')
  async leaveCommunity(
    @GetUser('id') userId: string,
    @Param('id') postId: string,
  ) {
    return await this.communityService.leaveCommunity(userId, postId);
  }

  //  멤버 상태 변경 (방장 전용)
  @UseGuards(JwtAuthGuard)
  @Patch(':id/members/:userId/status')
  async updateMemberStatus(
    @GetUser('id') hostId: string,
    @Param('id') postId: string,
    @Param('userId') targetUserId: string,
    @Body() dto: UpdateMemberStatusDto,
  ) {
    return this.communityService.updateMemberStatus(
      hostId,
      postId,
      targetUserId,
      dto,
    );
  }

  // 채팅 메시지 전송
  @UseGuards(JwtAuthGuard)
  @Post(':id/chats')
  async createChatMessage(
    @GetUser('id') userId: string,
    @Param('id') postId: string,
    @Body() dto: CreateChatMessageDto,
  ) {
    return this.communityService.createChatMessage(userId, postId, dto);
  }

  // 채팅 메시지 조회
  @UseGuards(JwtAuthGuard)
  @Get(':id/chats')
  async getChatMessages(
    @GetUser('id') userId: string,
    @Param('id') postId: string,
  ) {
    return this.communityService.getChatMessages(userId, postId);
  }

  // 채팅 메시지 삭제
  @UseGuards(JwtAuthGuard)
  @Delete(':id/chats/:messageId')
  async deleteChatMessage(
    @GetUser('id') userId: string,
    @Param('id') postId: string,
    @Param('messageId') messageId: string,
  ) {
    return this.communityService.deleteChatMessage(userId, postId, messageId);
  }
}
