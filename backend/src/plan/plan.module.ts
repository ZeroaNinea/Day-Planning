import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';

import { Plan } from '../entities/plan.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([Plan, User]),
  ],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
