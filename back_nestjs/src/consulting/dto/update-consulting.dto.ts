import { PartialType } from '@nestjs/mapped-types';
import { CreateConsultingDto } from './create-consulting.dto';

export class UpdateConsultingDto extends PartialType(CreateConsultingDto) {}
