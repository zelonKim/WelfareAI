import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateChatMessageDto {
  @IsString()
  @IsNotEmpty({ message: '메시지 내용을 입력해주세요.' })
  @MaxLength(1000, { message: '메시지는 최대 1000자까지 입력 가능합니다.' })
  message!: string;
}