import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { KeyStoreService } from './key-store.service';
import { JwtStrategy } from './jwt.strategy';
import { KeyRotationService } from './key-rotation.service';

import { AuthController } from './auth.controller';

import { User } from '../entities/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([User]),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    KeyRotationService,
    AuthService,
    UsersService,
    KeyStoreService,
    JwtStrategy,
  ],
})
export class AuthModule {}
