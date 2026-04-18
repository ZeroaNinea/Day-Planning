import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';

import { AppService } from './app.service';
import { KeyStoreService } from './auth/key-store.service';
import { KeyRotationService } from './auth/key-rotation.service';

import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';

import { AuthModule } from './auth/auth.module';

import { User } from './entities/user.entity';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PlanModule } from './plan/plan.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        entities: [User],
      }),
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UsersModule,
    PlanModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    AuthService,
    UsersService,
    KeyStoreService,
    KeyRotationService,
    JwtService,
  ],
})
export class AppModule {}
