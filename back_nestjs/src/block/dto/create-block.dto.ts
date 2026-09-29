import { IsNotEmpty, IsString } from 'class-validator';

export class BlockUserDto {
  @IsString()
  @IsNotEmpty({ message: '차단할 유저의 닉네임을 입력해주세요.' })
  blockedUserName!: string;
}
