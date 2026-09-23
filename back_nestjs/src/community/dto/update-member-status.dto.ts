import { IsEnum, IsNotEmpty } from 'class-validator';
import { CommunityMemberStatus } from '@prisma/client';

export class UpdateMemberStatusDto {
  @IsNotEmpty({ message: '변경할 상태값을 입력해주세요.' })
  @IsEnum(CommunityMemberStatus, { message: '올바른 상태값이 아닙니다.' })
  status!: CommunityMemberStatus;
}