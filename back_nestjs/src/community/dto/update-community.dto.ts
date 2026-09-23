import { PartialType } from '@nestjs/mapped-types';
import { CreateCommunityPostDto } from './create-community.dto';

export class UpdateCommunityPostDto extends PartialType(
  CreateCommunityPostDto,
) {}
