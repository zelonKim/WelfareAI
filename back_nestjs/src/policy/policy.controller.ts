import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PolicyService } from './policy.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { SearchPolicyDto } from './dto/search-policy.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('policies')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  // 1. 복지 정책 생성 
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  createPolicy(@Body() dto: CreatePolicyDto) {
    return this.policyService.createPolicy(dto);
  }

  // 2. 복지 정책 검색 조회 
  @Get()
  getPolicies(@Query() query: SearchPolicyDto) {
    return this.policyService.getPolicies(query);
  }

  // 3. 복지 정책 상세 조회 
  @Get(':id')
  getPolicyById(@Param('id') id: string) {
    return this.policyService.getPolicyById(id);
  }

  // 4. 복지 정책 수정 
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  updatePolicy(@Param('id') id: string, @Body() dto: UpdatePolicyDto) {
    return this.policyService.updatePolicy(id, dto);
  }

  // 5. 복지 정책 삭제 
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  deletePolicy(@Param('id') id: string) {
    return this.policyService.deletePolicy(id);
  }
}