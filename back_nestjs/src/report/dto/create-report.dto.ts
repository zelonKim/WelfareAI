import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ReportReason } from '@prisma/client';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty({ message: '신고할 대상을 입력해주세요.' })
  reportedUserName!: string;

  @IsEnum(ReportReason, {
    message: '올바른 신고 사유를 선택해주세요.',
  })
  @IsNotEmpty({ message: '신고 사유를 선택해주세요.' })
  reason!: ReportReason;

  @IsString()
  @IsNotEmpty({ message: '상세 내용을 입력해주세요.' })
  details!: string;
}
