import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. @Roles() 데코레이터에서 요구하는 역할 목록 가져오기
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 요구하는 역할 지정이 따로 없는 엔드포인트라면 통과
    if (!requiredRoles) {
      return true;
    }

    // 2. JwtAuthGuard를 거쳐 req.user에 담긴 유저 정보 가져오기
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('인증 정보가 존재하지 않습니다.');
    }

    // 3. 유저의 role이 허용된 roles 목록에 포함되어 있는지 검증
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }

    return true;
  }
}