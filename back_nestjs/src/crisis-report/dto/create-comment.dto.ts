import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  @MaxLength(500, { message: '댓글은 최대 500자까지 작성 가능합니다.' })
  content!: string;
}
