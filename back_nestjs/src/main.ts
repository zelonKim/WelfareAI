import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Railway의 PORT 환경변수를 우선 사용하고, 없으면 3000 포트 사용
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`NestJS server is running on port ${port}`);
}

// Promises must be awaited 경고 해결
bootstrap().catch((err) => {
  console.error('Failed to start NestJS server:', err);
});
