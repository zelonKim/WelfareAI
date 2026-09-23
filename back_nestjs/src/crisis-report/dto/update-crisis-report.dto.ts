import { PartialType } from '@nestjs/mapped-types';
import { CreateCrisisReportDto } from './create-crisis-report.dto';

export class UpdateCrisisReportDto extends PartialType(CreateCrisisReportDto) {}
