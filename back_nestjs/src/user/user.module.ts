import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { R2Provider } from 'utils/r2.provider';

@Module({
  controllers: [UserController],
  providers: [UserService, R2Provider],
})
export class UserModule {}
