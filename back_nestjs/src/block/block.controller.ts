import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockUserDto } from './dto/create-block.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('block')
@UseGuards(JwtAuthGuard)
export class BlockController {
  constructor(private readonly blockService: BlockService) {}
  @Get()
  async getBlockedUsers(@GetUser('id') blockerId: string) {
    return await this.blockService.getBlockedUsers(blockerId);
  }

  @Post()
  async blockUser(@GetUser('id') blockerId: string, @Body() dto: BlockUserDto) {
    return await this.blockService.blockUser(blockerId, dto.blockedUserName);
  }

  @Delete(':blockedId')
  async unblockUser(
    @GetUser('id') blockerId: string,
    @Param('blockedId') blockedId: string,
  ) {
    return await this.blockService.unblockUser(blockerId, blockedId);
  }
}
