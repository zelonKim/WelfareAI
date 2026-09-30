
import { OAuth2Client } from 'google-auth-library';
import { UnauthorizedException } from '@nestjs/common';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(idToken: string) {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new UnauthorizedException('유효하지 않은 구글 토큰입니다.');
    }
    return { email: payload.email, sub: payload.sub };
  } catch (error) {
    console.error('구글 토큰 검증 에러', error);
    throw new UnauthorizedException('구글 토큰 검증에 실패했습니다.');
  }
}
