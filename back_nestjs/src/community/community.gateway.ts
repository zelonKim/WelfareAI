import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommunityService } from './community.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chats',
})
export class CommunityGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(private readonly communityService: CommunityService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
  
  //////////////////////////////////////////////////////////////////////////

  // 1. 특정 커뮤니티 채팅방 입장
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { postId: string },
  ) {
    client.join(`community_${data.postId}`);
    console.log(`Client ${client.id} joined room: community_${data.postId}`);
  }

  //////////////////////////////////////////////////////////////////////////

  // 2. 특정 커뮤니티 채팅방 퇴장
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { postId: string },
  ) {
    client.leave(`community_${data.postId}`);
    console.log(`Client ${client.id} left room: community_${data.postId}`);
  }

  //////////////////////////////////////////////////////////////////////////

  // 3. 메시지 전송
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { postId: string; userId: string; message: string },
  ) {
    const { postId, userId, message } = data;

    const newMessage = await this.communityService.createChatMessage(
      userId,
      postId,
      { message },
    );
    this.server.to(`community_${postId}`).emit('newMessage', newMessage);

    return newMessage;
  }

  //////////////////////////////////////////////////////////////////////////

  // 4. 메시지 삭제
  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { postId: string; userId: string; messageId: string },
  ) {
    const { postId, userId, messageId } = data;

    await this.communityService.deleteChatMessage(userId, postId, messageId);

    // 해당 채팅방에 메시지 삭제 이벤트 브로드캐스트
    this.server.to(`community_${postId}`).emit('messageDeleted', { messageId });

    return { success: true };
  }
}
