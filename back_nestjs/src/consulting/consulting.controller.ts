import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CreateConsultingDto } from './dto/create-consulting.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { ConsultingService } from './consulting.service';

@Controller('consulting')
@UseGuards(JwtAuthGuard)
export class ConsultingController {
  constructor(private readonly aiConsultingService: ConsultingService) {}

  // 1. AI 상담 생성
  @Post()
  createConsulting(
    @GetUser('id') userId: string,
    @Body() dto: CreateConsultingDto,
  ) {
    return this.aiConsultingService.createConsulting(userId, dto);
  }

  // 2. 내 AI 상담 전체 조회
  @Get()
  getMyConsultings(@GetUser('id') userId: string) {
    return this.aiConsultingService.getMyConsultings(userId);
  }
  
  // 5. 모든 상담 내역 삭제
  @Delete('all')
  deleteAllConsulting(@GetUser('id') userId: string) {
    return this.aiConsultingService.deleteAllConsulting(userId);
  }

  // 3. AI 상담 단건 조회
  @Get(':id')
  getConsultingById(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.aiConsultingService.getConsultingById(userId, id);
  }

  // 4. AI 상담 내역 삭제
  @Delete(':id')
  deleteConsulting(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.aiConsultingService.deleteConsulting(userId, id);
  }
}
