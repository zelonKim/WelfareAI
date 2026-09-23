import { IsEnum, IsNotEmpty } from 'class-validator';
import { CrisisStatus } from '@prisma/client';

export class UpdateCrisisStatusDto {
  @IsNotEmpty({ message: '제보 상태값을 입력해주세요' })
  @IsEnum(CrisisStatus, { message: '올바른 제보 상태값이 아닙니다.' })
  status!: CrisisStatus;
}
