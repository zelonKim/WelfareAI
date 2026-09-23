import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConsultingDto {
  @IsString()
  @IsNotEmpty({ message: '상담 질문 내용을 입력해주세요.' })
  question!: string;
}
