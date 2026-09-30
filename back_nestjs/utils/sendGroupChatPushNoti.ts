import { PrismaService } from 'prisma/prisma.service';
import { NotificationService } from 'src/notification/notification.service';

export async function sendGroupChatPushNoti(
  prisma: PrismaService,
  notificationService: NotificationService,
  postId: string,
  senderId: string,
  message: string,
  senderNickname: string,
) {
  // 모임 정보 및 승인된 멤버(APPROVED) 목록 조회
  const community = await prisma.communityPost.findUnique({
    where: { id: postId },
    select: {
      title: true,
      hostId: true,
      members: {
        where: { status: 'APPROVED' },
        select: { userId: true },
      },
    },
  });

  if (!community) return;

  // 알림을 받을 대상 사용자 ID 추출 (방장 + 승인된 멤버 전체 중 '나' 제외)
  const allMemberIds = new Set([
    community.hostId,
    ...community.members.map((m) => m.userId),
  ]);
  allMemberIds.delete(senderId); // 메시지 작성자 본인 제외

  const targetUserIds = Array.from(allMemberIds);

  if (targetUserIds.length === 0) return;

  // 대상 유저들의 pushToken 및 유저 정보 조회
  const targetUsers = await prisma.user.findMany({
    where: {
      id: { in: targetUserIds },
      pushToken: { not: null }, // pushToken이 등록된 유저만
    },
    select: { pushToken: true },
  });

  const pushTokens = targetUsers
    .map((u) => u.pushToken)
    .filter((token): token is string => Boolean(token));

  if (pushTokens.length === 0) return;

  // NotificationService를 통한 단체 푸시 발송
  await notificationService.sendMultiplePushNotifications({
    tokens: pushTokens,
    title: `${senderNickname}님의 대화`,
    body: message,
    data: {
      url: `/communityDetail/${postId}/chat`,
      id: postId,
    },
  });
}
