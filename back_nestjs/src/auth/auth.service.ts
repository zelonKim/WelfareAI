import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    if (!dto.isTermsAgreed) {
      throw new BadRequestException(
        '서비스 이용약관에 동의해야 가입할 수 있습니다.',
      );
    }

    if (!dto.isPrivacyAgreed) {
      throw new BadRequestException(
        '개인정보 처리방침에 동의해야 가입할 수 있습니다.',
      );
    }

    if (dto.password !== dto.passwordConfirm) {
      throw new BadRequestException('비밀번호가 서로 일치하지 않습니다.');
    }

    // 이메일 및 닉네임 중복 검사
    const [existingEmail, existingNickname] = await Promise.all([
      this.prisma.user.findUnique({ where: { email: dto.email } }),
      this.prisma.user.findFirst({ where: { nickname: dto.nickname } }),
    ]);

    if (existingEmail) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    if (existingNickname) {
      throw new ConflictException('이미 사용 중인 닉네임입니다.');
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const now = new Date();

    // DB에 유저 생성
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        nickname: dto.nickname,
        password: hashedPassword,
        termsAgreedAt: now,
        privacyAgreedAt: now,
        marketingAgreedAt: dto.isMarketingAgreed ? now : null,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        createdAt: true,
        role: true,
      },
    });

    // 토큰 발급
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: '회원가입이 완료되었습니다.',
      accessToken,
      user,
    };
  }

  //////////////////////////////////////////////////////////

  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) {
        throw new UnauthorizedException(
          '아이디 혹은 비밀번호가 일치하지 않습니다.',
        );
      }

      if (!user.password) {
        throw new UnauthorizedException('간편 로그인 계정입니다.');
      }

      const isPasswordValid = await bcrypt.compare(dto.password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException(
          '아이디 혹은 비밀번호가 일치하지 않습니다.',
        );
      }

      const payload = { sub: user.id, email: user.email, role: user.role };

      const accessToken = this.jwtService.sign(payload);

      return {
        message: '로그인에 성공했습니다.',
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          role: user.role,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Login Unexpected Error:', error);
      throw new InternalServerErrorException(
        '로그인 처리 중 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      );
    }
  }
}
