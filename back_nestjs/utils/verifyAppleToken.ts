import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { UnauthorizedException } from '@nestjs/common';

const client = jwksClient({
  jwksUri: 'https://appleid.apple.com/auth/keys',
  cache: true,
  rateLimit: true,
});

//////////////////////////////////////////////////////////////////////////////

const getAppleSigningKey = (kid: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    client.getSigningKey(kid, (err, key) => {
      if (err || !key) {
        return reject(
          new UnauthorizedException('애플 공개키를 가져오는데 실패했습니다.'),
        );
      }
      const signingKey = key.getPublicKey();

      if (!signingKey) {
        return reject(new Error('signingKey가 존재하지 않습니다.'));
      }
      resolve(signingKey);
    });
  });
};

//////////////////////////////////////////////////////////////////////////////

export async function verifyAppleToken(identityToken: string) {
  try {
    const decodedToken: any = jwt.decode(identityToken, { complete: true });
    const kid = decodedToken.header.kid;

    if (!decodedToken || !decodedToken.header?.kid || typeof kid !== 'string') {
      throw new UnauthorizedException('유효하지 않은 애플 토큰입니다.');
    }

    const key = await getAppleSigningKey(kid);

    const verifiedPayload: any = jwt.verify(identityToken, key, {
      algorithms: ['RS256'],
    });

    return {
      email: verifiedPayload.email,
      sub: verifiedPayload.sub,
    };
  } catch (error) {
    console.error('애플 토큰 검증 에러:', error);
    throw new UnauthorizedException('애플 토큰 검증에 실패했습니다.');
  }
}
