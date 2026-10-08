import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`NestJS server is running on port ${port}`);
}


bootstrap().catch((err) => {
  console.error('Failed to start NestJS server:', err);
});
