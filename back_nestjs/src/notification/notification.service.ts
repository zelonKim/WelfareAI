import { Injectable } from '@nestjs/common';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { PrismaService } from 'prisma/prisma.service';
import { SendMultiplePushNotificationsDto } from './dto/SendMultiplePushNotifications.dto';

interface SendPushNotificationDto {
  targetUserId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

@Injectable()
export class NotificationService {
  private expo = new Expo();

  constructor(private readonly prisma: PrismaService) {}

  async sendPushNotification({
    targetUserId,
    title,
    body,
    data,
  }: SendPushNotificationDto) {
    // 1. DB에서 targetUserId의 pushToken 조회
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    const pushToken = user?.pushToken;

    // 2. 푸시 토큰 유효성 검사
    if (!pushToken || !Expo.isExpoPushToken(pushToken)) {
      console.log(
        `${targetUserId}에 대한 푸시 토큰이 없거나, 유효하지 않습니다.`,
      );
      return;
    }

    // 3. Expo 푸시 알림 발송
    try {
      const tickets = await this.expo.sendPushNotificationsAsync([
        {
          to: pushToken,
          sound: 'default',
          title,
          body,
          data,
          channelId: 'default',
          priority: 'high',
        },
      ]);
      return tickets;
    } catch (error) {
      console.log(`푸시 알림 전송에 실패했습니다.`, error);
    }
  }

  ///////////////////////////////////////////////////////////////////

  async sendMultiplePushNotifications({
    tokens,
    title,
    body,
    data,
  }: SendMultiplePushNotificationsDto) {
    // 1. 유효한 Expo 푸시 토큰만 필터링
    const validTokens = tokens.filter((token) => Expo.isExpoPushToken(token));

    if (validTokens.length === 0) {
      console.log('유효한 푸시 토큰이 존재하지 않습니다.');
      return [];
    }

    // 2. 메시지 객체 배열 생성
    const messages: ExpoPushMessage[] = validTokens.map((token) => ({
      to: token,
      sound: 'default',
      title,
      body,
      data,
      channelId: 'default',
      priority: 'high',
    }));

    // 3. Expo 서버 배치 전송 크기에 맞게 청크(Chunk) 분할 및 발송
    const chunks = this.expo.chunkPushNotifications(messages);
    const tickets: ExpoPushTicket[] = [];

    try {
      for (const chunk of chunks) {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      }
      return tickets;
    } catch (error) {
      console.log('푸시 알림 전송에 실패했습니다.', error);
      return [];
    }
  }
}
