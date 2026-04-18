import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { KeyRotationService } from './auth/key-rotation.service';

async function bootstrap() {
  // Rotate keys every 24 hours.
  const keyRotationService = new KeyRotationService();
  // const keyRotationService = app.get(KeyRotationService);
  keyRotationService.rotateKeys();
  setInterval(
    () => {
      keyRotationService.rotateKeys();
    },
    24 * 60 * 60 * 1000,
  );

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://127.0.0.1:5500/',
      'http://localhost:5500/',
      'http://127.0.0.1:5500',
      'http://localhost:5500',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('PORT') ?? 3000);
}
bootstrap()
  .then(() => console.log(' 🚀 Server started'))
  .catch((error) => console.log('Server failed:', error));
