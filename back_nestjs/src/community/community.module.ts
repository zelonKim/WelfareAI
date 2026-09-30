import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { CommunityGateway } from './community.gateway';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [CommunityController],
  providers: [CommunityService, CommunityGateway],
})
export class CommunityModule {}
