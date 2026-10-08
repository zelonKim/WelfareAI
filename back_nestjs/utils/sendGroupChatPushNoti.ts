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

  const allMemberIds = new Set([
    community.hostId,
    ...community.members.map((m) => m.userId),
  ]);
  allMemberIds.delete(senderId);

  const targetUserIds = Array.from(allMemberIds);

  if (targetUserIds.length === 0) return;

  const targetUsers = await prisma.user.findMany({
    where: {
      id: { in: targetUserIds },
      pushToken: { not: null },
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
