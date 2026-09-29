import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CrisisReportModule } from './crisis-report/crisis-report.module';
import { CommunityModule } from './community/community.module';
import { PlaceModule } from './place/place.module';
import { PolicyModule } from './policy/policy.module';
import { ConsultingModule } from './consulting/consulting.module';
import { ReportModule } from './report/report.module';
import { BlockModule } from './block/block.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    CrisisReportModule,
    CommunityModule,
    PlaceModule,
    PolicyModule,
    ConsultingModule,
    ReportModule,
    BlockModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
