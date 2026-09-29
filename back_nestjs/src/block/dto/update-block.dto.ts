import { PartialType } from '@nestjs/mapped-types';
import { BlockUserDto } from './create-block.dto';

export class UpdateBlockDto extends PartialType(BlockUserDto) {}
