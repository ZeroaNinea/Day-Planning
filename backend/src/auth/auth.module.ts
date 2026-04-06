import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { KeyStoreService } from './key-store.service';
import { JwtStrategy } from './jwt.strategy';
import { KeyRotationService } from './key-rotation.service';

import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AuthController],
  providers: [KeyRotationService, AuthService, KeyStoreService, JwtStrategy],
})
export class AuthModule {}
