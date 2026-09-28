import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SearchPolicyDto } from './dto/search-policy.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { XMLParser } from 'fast-xml-parser';
import {
  INTRS_THEMA_MAP,
  LIFE_CYCLE_MAP,
  TRGTER_INDVDL_MAP,
} from 'constants/PolicyCode';
import { PolicyItem, PolicyResponse } from './interfaces/policy.interface';

@Injectable()
export class PolicyService {
  private parser!: XMLParser;

  constructor(private readonly httpService: HttpService) {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      trimValues: true,
    });
  }

  async getPolicies(dto: SearchPolicyDto): Promise<PolicyResponse> {
    const {
      keyword,
      category,
      lifeCycle,
      targetGroup,
      age,
      onappPsbltYn,
      pageNo = 1,
      numOfRows = 10,
    } = dto;

    const baseUrl =
      'https://apis.data.go.kr/B554287/NationalWelfareInformationsV001/NationalWelfarelistV001';
    const serviceKey = process.env.PUBLIC_WELFARE_API_KEY;
    const apiUrl = `${baseUrl}?serviceKey=${serviceKey}`;

    // 검색어 파라미터 코드 변환
    const intrsThemaArray = category ? INTRS_THEMA_MAP[category] : undefined;
    const lifeArray = lifeCycle ? LIFE_CYCLE_MAP[lifeCycle] : undefined;
    const trgterIndvdlArray = targetGroup
      ? TRGTER_INDVDL_MAP[targetGroup]
      : undefined;

    try {
      const response = await firstValueFrom(
        this.httpService.get(apiUrl, {
          params: {
            callTp: 'L', // L: 목록 조회
            pageNo, // 페이지 번호
            numOfRows, // 한 페이지 결과 수
            srchKeyCode: '003', // 003: 제목+내용 검색
            searchWrd: keyword || undefined, // 검색어
            intrsThemaArray, // 관심주제 코드
            lifeArray, // 생애주기 코드
            trgterIndvdlArray, // 가구유형 코드
            age: age || undefined, // 나이
            onappPsbltYn: onappPsbltYn || undefined, // 온라인 신청 가능여부
            orderBy: 'popular', // 정렬 순서 (popular / date)
          },
          responseType: 'text', // XML 수신
        }),
      );

      // XML -> JS 객체 파싱
      const jsonObj = this.parser.parse(response.data);
      const wantedList = jsonObj?.wantedList;

      // 상위 메타 정보
      const totalCount = Number(wantedList?.totalCount || 0);
      const currentPage = Number(wantedList?.pageNo || pageNo);
      const rowsPerPage = Number(wantedList?.numOfRows || numOfRows);

      // 목록 노드 파싱 
      const rawItems = wantedList?.servList || [];
      const items = Array.isArray(rawItems) ? rawItems : [rawItems];

      // 명세서 1:1 필드 매핑
      const mappedItems: PolicyItem[] = items.map((item: any) => ({
        id: String(item.servId || ''), // servId
        title: item.servNm || '', // servNm
        summary: item.servDgst || '', // servDgst
        department: item.jurMnofNm || '', // jurMnofNm
        organization: item.jurOrgNm || '', // jurOrgNm
        inquiryCount: Number(item.inqNum || 0), // inqNum
        detailUrl: item.servDtlLink || '', // servDtlLink
        registeredAt: item.svcfrstRegTs || '', // svcfrstRegTs
        lifeCycle: item.lifeArray || '', // lifeArray
        category: item.intrsThemaArray || '일반', // intrsThemaArray
        targetGroup: item.trgterIndvdlArray || '전체', // trgterIndvdlArray
        supportCycle: item.sprtCycNm || '', // sprtCycNm
        provisionType: item.srvPvsnNm || '', // srvPvsnNm
        contact: String(item.rprsCtadr || ''), // rprsCtadr
        isOnlineApply: item.onappPsbltYn === 'Y', // onappPsbltYn
      }));

      return {
        totalCount,
        pageNo: currentPage,
        numOfRows: rowsPerPage,
        items: mappedItems,
      };
    } catch (error) {
      console.error('복지 API 파싱 에러:', error);
      throw new InternalServerErrorException(
        '복지 정책 데이터를 불러오는 중 오류가 발생했습니다.',
      );
    }
  }
}

// 1. 정책 생성
// async createPolicy(dto: CreatePolicyDto) {
//   return this.prisma.welfarePolicy.create({
//     data: dto,
//   });
// }

// 3. 정책 단건 상세 조회
// async getPolicyById(id: string) {
//   const policy = await this.prisma.welfarePolicy.findUnique({
//     where: { id },
//     include: {
//       _count: {
//         select: { bookmarks: true },
//       },
//     },
//   });

//   if (!policy) {
//     throw new NotFoundException('존재하지 않는 복지 정책입니다.');
//   }

//   return policy;
// }

// 4. 정책 수정
// async updatePolicy(id: string, dto: UpdatePolicyDto) {
//   await this.getPolicyById(id);

//   return this.prisma.welfarePolicy.update({
//     where: { id },
//     data: dto,
//   });
// }

// 5. 정책 삭제
// async deletePolicy(id: string) {
//   await this.getPolicyById(id);

//   await this.prisma.welfarePolicy.delete({
//     where: { id },
//   });

//   return { message: '복지 정책이 성공적으로 삭제되었습니다.' };
// }
