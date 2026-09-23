import { PartialType } from '@nestjs/mapped-types';
import { CreateWelfarePlaceDto } from './create-welfare-place.dto';

export class UpdateWelfarePlaceDto extends PartialType(CreateWelfarePlaceDto) {}