import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WelfarePlaceService } from './place.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CreateWelfarePlaceDto } from './dto/create-welfare-place.dto';
import { UpdateWelfarePlaceDto } from './dto/update-welfare-place.dto';
import { QueryWelfarePlaceDto } from './dto/query-welfare-place.dto';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('place')
export class WelfarePlaceController {
  constructor(private readonly welfarePlaceService: WelfarePlaceService) {}

  // 1. 장소 등록
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  @Post()
  async createPlace(@Body() dto: CreateWelfarePlaceDto) {
    return this.welfarePlaceService.createPlace(dto);
  }

  // 2. 전체 및 검색 목록 조회
  @Get()
  async getAllPlaces(
    @Query() query: QueryWelfarePlaceDto,
    @GetUser('id') userId?: string,
  ) {
    return this.welfarePlaceService.getAllPlaces(query, userId);
  }

  // 3. 내 북마크 목록 조회
  @UseGuards(JwtAuthGuard)
  @Get('my/bookmarks')
  async getMyBookmarks(@GetUser('id') userId: string) {
    return this.welfarePlaceService.getMyBookmarks(userId);
  }

  // 4. 단일 장소 상세 조회
  @Get(':id')
  async getPlaceById(@Param('id') id: string, @GetUser('id') userId?: string) {
    return this.welfarePlaceService.getPlaceById(id, userId);
  }

  // 5. 장소 수정
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  @Patch(':id')
  async updatePlace(
    @Param('id') id: string,
    @Body() dto: UpdateWelfarePlaceDto,
  ) {
    return this.welfarePlaceService.updatePlace(id, dto);
  }

  // 6. 장소 삭제
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  @Delete(':id')
  async deletePlace(@Param('id') id: string) {
    return this.welfarePlaceService.deletePlace(id);
  }

  // 7. 북마크 토글 
  @UseGuards(JwtAuthGuard)
  @Post(':id/bookmark')
  async toggleBookmark(
    @GetUser('id') userId: string,
    @Param('id') placeId: string,
  ) {
    return this.welfarePlaceService.toggleBookmark(userId, placeId);
  }
}
