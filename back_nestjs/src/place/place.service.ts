import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateWelfarePlaceDto } from './dto/create-welfare-place.dto';
import { UpdateWelfarePlaceDto } from './dto/update-welfare-place.dto';
import { QueryWelfarePlaceDto } from './dto/query-welfare-place.dto';

@Injectable()
export class WelfarePlaceService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. 장소 등록 (관리자용)
  async createPlace(dto: CreateWelfarePlaceDto) {
    const place = await this.prisma.welfarePlace.create({
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });

    return {
      message: '복지 장소/행사가 성공적으로 등록되었습니다.',
      place,
    };
  }

  ////////////////////////////////////////////////////////////////////////////////

  // 2. 목록 조회 (검색, 카테고리 필터, 지도 영역 조회 포함 + 현재 유저의 북마크 여부 표시)
  async getAllPlaces(query: QueryWelfarePlaceDto, userId?: string) {
    const { search, swLatitude, swLongitude, neLatitude, neLongitude } = query;

    // Prisma 조건식 동적 생성
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 지도 화면 영역 반경 검색
    if (swLatitude && swLongitude && neLatitude && neLongitude) {
      where.latitude = { gte: swLatitude, lte: neLatitude };
      where.longitude = { gte: swLongitude, lte: neLongitude };
    }

    const places = await this.prisma.welfarePlace.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        // 로그인한 유저인 경우 본인의 북마크 포함 여부 가져오기
        bookmarks: userId ? { where: { userId } } : false,
        _count: { select: { bookmarks: true } },
      },
    });

    // 응답 데이터에 isBookmarked (Boolean) 플래그 조합
    return places.map((place) => {
      const isBookmarked = userId ? place.bookmarks.length > 0 : false;
      const { bookmarks, ...rest } = place;
      return {
        ...rest,
        isBookmarked,
        bookmarks,
        bookmarkCount: place._count.bookmarks,
      };
    });
  }

  ////////////////////////////////////////////////////////////////////////////////

  // 3. 단일/상세 조회
  async getPlaceById(id: string, userId?: string) {
    const place = await this.prisma.welfarePlace.findUnique({
      where: { id },
      include: {
        bookmarks: userId ? { where: { userId } } : false,
        _count: { select: { bookmarks: true } },
      },
    });

    if (!place) {
      throw new NotFoundException('해당 복지 장소를 찾을 수 없습니다.');
    }

    const isBookmarked = userId ? place.bookmarks.length > 0 : false;
    const { bookmarks, ...rest } = place;

    return {
      ...rest,
      isBookmarked,
      bookmarks,
      bookmarkCount: place._count.bookmarks,
    };
  }

  ////////////////////////////////////////////////////////////////////////////////

  // 4. 변경 (관리자용)
  async updatePlace(id: string, dto: UpdateWelfarePlaceDto) {
    await this.getPlaceById(id);

    const updatedPlace = await this.prisma.welfarePlace.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.startDate !== undefined && {
          startDate: dto.startDate ? new Date(dto.startDate) : null,
        }),
        ...(dto.endDate !== undefined && {
          endDate: dto.endDate ? new Date(dto.endDate) : null,
        }),
      },
    });

    return {
      message: '장소 정보가 성공적으로 변경되었습니다.',
      place: updatedPlace,
    };
  }

  ////////////////////////////////////////////////////////////////////////////////

  // 5. 삭제 (관리자용)
  async deletePlace(id: string) {
    await this.getPlaceById(id);

    await this.prisma.welfarePlace.delete({
      where: { id },
    });

    return { message: '장소 정보가 성공적으로 삭제되었습니다.' };
  }

  ////////////////////////////////////////////////////////////////////////////////

  // 6. 북마크 토글
  async toggleBookmark(userId: string, placeId: string) {
    await this.getPlaceById(placeId);

    const existingBookmark = await this.prisma.mapBookmark.findUnique({
      where: { userId_placeId: { userId, placeId } },
    });

    // 이미 북마크 되어있으면 해제
    if (existingBookmark) {
      await this.prisma.mapBookmark.delete({
        where: { userId_placeId: { userId, placeId } },
      });
      return { message: '즐겨찾기에서 삭제되었습니다.', isBookmarked: false };
    }

    // 북마크 등록
    await this.prisma.mapBookmark.create({
      data: { userId, placeId },
    });

    return { message: '즐겨찾기에 추가되었습니다.', isBookmarked: true };
  }

  ////////////////////////////////////////////////////////////////////////////////

  // 7. 내가 북마크한 장소 목록 조회
  async getMyBookmarks(userId: string) {
    const bookmarks = await this.prisma.mapBookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        place: true,
      },
    });

    return bookmarks.map((b) => b.place);
  }
}
