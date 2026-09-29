import { Controller, Get, Query } from '@nestjs/common';
import { PolicyService } from './policy.service';
import { SearchPolicyDto } from './dto/search-policy.dto';

@Controller('policy')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Get()
  getPolicies(@Query() query: SearchPolicyDto) {
    return this.policyService.getPolicies(query);
  }
}
