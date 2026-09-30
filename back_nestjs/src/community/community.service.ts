import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCommunityPostDto } from './dto/create-community.dto';
import { UpdateCommunityPostDto } from './dto/update-community.dto';
import { CommunityMemberStatus } from '@prisma/client';
import { UpdateMemberStatusDto } from './dto/update-member-status.dto';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { sendGroupChatPushNoti } from 'utils/sendGroupChatPushNoti';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class CommunityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async createPost(hostId: string, dto: CreateCommunityPostDto) {
    const post = await this.prisma.communityPost.create({
      data: {
        hostId,
        type: dto.type,
        title: dto.title,
        content: dto.content,
        images: dto.images || [],
        maxMembers: dto.maxMembers,
        members: {
          create: {
            userId: hostId,
            status: CommunityMemberStatus.APPROVED,
          },
        },
      },
    });

    return {
      message: '커뮤니티 게시글이 성공적으로 등록되었습니다.',
      post,
    };
  }

  ////////////////////////////////////////////////////////////////////////////////

  // 2. 모임 조회
  async getAllPosts() {
    return this.prisma.communityPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        host: {
          select: {
            id: true,
            nickname: true,
            email: true,
            profileImage: true,
          },
        },
        _count: {
          select: {
            members: {
              where: { status: 'APPROVED' },
            },
          },
        },
      },
    });
  }

  ////////////////////////////////////////////////////////////////////////////////

  // 나의 모임 목록 조회 (PENDING, APPROVED 상태인 모임)
  async getMyPosts(userId: string) {
    return this.prisma.communityPost.findMany({
      where: {
        OR: [
          { hostId: userId },
          {
            members: {
              some: {
                userId,
                status: {
                  in: [
                    CommunityMemberStatus.PENDING,
                    CommunityMemberStatus.APPROVED,
                  ],
                },
              },
            },
          },
        ],
      },
      include: {
        host: {
          select: {
            id: true,
            nickname: true,
            email: true,
            profileImage: true,
          },
        },
        _count: {
          select: {
            members: {
              where: { status: 'APPROVED' },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  ////////////////////////////////////////////////////////////////////////////////

  // 3. 모임 상세 조회
  async getPostById(postId: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id: postId },
      include: {
        host: {
          select: {
            id: true,
            nickname: true,
            email: true,
            profileImage: true,
          },
        },
        members: {
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
        },
      },
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    return post;
  }

  ////////////////////////////////////////////////////////////////////////////////

  // 4. 모임 변경
  async updatePost(
    hostId: string,
    postId: string,
    dto: UpdateCommunityPostDto,
  ) {
    const post = await this.getPostById(postId);

    // 작성자(Host) 검증
    if (post.hostId !== hostId) {
      throw new ForbiddenException('본인의 게시글만 수정할 수 있습니다.');
    }

    const updatedPost = await this.prisma.communityPost.update({
      where: { id: postId },
      data: dto,
    });

    return {
      message: '게시글이 성공적으로 수정되었습니다.',
      post: updatedPost,
    };
  }

  ////////////////////////////////////////////////////////////////////////////////

  // 5. 모임 삭제
  async deletePost(hostId: string, postId: string) {
    const post = await this.getPostById(postId);

    // 작성자(Host) 검증
    if (post.hostId !== hostId) {
      throw new ForbiddenException('본인의 게시글만 삭제할 수 있습니다.');
    }

    await this.prisma.communityPost.delete({
      where: { id: postId },
    });

    return {
      message: '게시글이 성공적으로 삭제되었습니다.',
    };
  }

  ////////////////////////////////////////////////////////////////////////////////

  // 커뮤니티 참여 신청
  async applyCommunity(userId: string, postId: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id: postId },
      include: {
        _count: { select: { members: { where: { status: 'APPROVED' } } } },
      },
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    // 방장 본인은 신청 불가
    if (post.hostId === userId) {
      throw new BadRequestException('방장은 참여 신청을 할 수 없습니다.');
    }

    // 인원수 제한 체크
    if (post.maxMembers && post._count.members >= post.maxMembers) {
      throw new BadRequestException('정원이 초과하여 참여 신청할 수 없습니다.');
    }

    // 이미 신청/참여/강퇴 내역 확인
    const existingMember = await this.prisma.communityMember.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existingMember) {
      if (existingMember.status === CommunityMemberStatus.BANNED) {
        throw new ForbiddenException('강퇴 처리되어 다시 신청할 수 없습니다.');
      }
      throw new BadRequestException(
        '이미 신청했거나 참여 중인 커뮤니티입니다.',
      );
    }

    // PENDING 상태로 참여 신청 생성
    return this.prisma.communityMember.create({
      data: {
        postId,
        userId,
        status: CommunityMemberStatus.PENDING,
      },
    });
  }

  ////////////////////////////////////////////////////////////////////////////////

  // 멤버 상태 변경 - 승인/강퇴 등 (방장 전용)
  async updateMemberStatus(
    hostId: string,
    postId: string,
    targetUserId: string,
    dto: UpdateMemberStatusDto,
  ) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    // 방장 권한 확인
    if (post.hostId !== hostId) {
      throw new ForbiddenException('방장만 멤버 상태를 변경할 수 있습니다.');
    }

    const targetMember = await this.prisma.communityMember.findUnique({
      where: { postId_userId: { postId, userId: targetUserId } },
    });

    if (!targetMember) {
      throw new NotFoundException('해당 참여자를 찾을 수 없습니다.');
    }

    return this.prisma.communityMember.update({
      where: { postId_userId: { postId, userId: targetUserId } },
      data: { status: dto.status },
    });
  }

  ////////////////////////////////////////////////////////////////////////////////

  // 채팅 접근 권한 헬퍼 메서드
  private async validateChatAccess(userId: string, postId: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    // 방장인 경우 통과
    if (post.hostId === userId) {
      return true;
    }

    // 승인된 멤버인지 확인
    const member = await this.prisma.communityMember.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (!member || member.status !== CommunityMemberStatus.APPROVED) {
      throw new ForbiddenException(
        '승인된 멤버만 채팅 기능을 이용할 수 있습니다.',
      );
    }

    return true;
  }

  ////////////////////////////////////////////////////////////////////////////////

  // 채팅 메시지 전송
  async createChatMessage(
    userId: string,
    postId: string,
    dto: CreateChatMessageDto,
  ) {
    await this.validateChatAccess(userId, postId);

    const newMessage = await this.prisma.chatMessage.create({
      data: {
        postId,
        userId,
        message: dto.message,
      },
      select: {
        id: true,
        postId: true,
        userId: true,
        message: true,
        createdAt: true,
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

    const senderNickname = newMessage.user?.nickname ?? '알 수 없음';

    sendGroupChatPushNoti(
      this.prisma,
      this.notificationService,
      postId,
      userId,
      dto.message,
      senderNickname,
    ).catch((err: Error) => {
      console.error('모임 채팅방 알림 전송 실패:', err.message);
    });

    return newMessage;
  }

  ////////////////////////////////////////////////////////////////////////////////

  // 채팅 메시지 조회
  async getChatMessages(userId: string, postId: string) {
    await this.validateChatAccess(userId, postId);

    return this.prisma.chatMessage.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
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

  // 채팅 메시지 삭제
  async deleteChatMessage(userId: string, postId: string, messageId: string) {
    await this.validateChatAccess(userId, postId);

    const message = await this.prisma.chatMessage.findUnique({
      where: { id: messageId },
      include: { post: { select: { hostId: true } } },
    });

    if (!message || message.postId !== postId) {
      throw new NotFoundException('해당 메시지를 찾을 수 없습니다.');
    }

    const isOwner = message.userId === userId;
    const isHost = message.post.hostId === userId;

    if (!isOwner && !isHost) {
      throw new ForbiddenException(
        '본인의 메시지 혹은 방장만 삭제할 수 있습니다.',
      );
    }

    await this.prisma.chatMessage.delete({
      where: { id: messageId },
    });

    return { message: '메시지가 성공적으로 삭제되었습니다.' };
  }
}
