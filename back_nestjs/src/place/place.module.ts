import { Module } from '@nestjs/common';
import { WelfarePlaceService } from './place.service';
import { WelfarePlaceController } from './place.controller';

@Module({
  controllers: [WelfarePlaceController],
  providers: [WelfarePlaceService],
})
export class PlaceModule {}
