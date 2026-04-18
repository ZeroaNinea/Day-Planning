import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CurrentUser } from '../common/decorators/user.decorator';
import { CreateDto } from './dto/create.dto';

import { PlanService } from './plan.service';

@Controller('plan')
@UseGuards(AuthGuard('jwt'))
export class PlanController {
  constructor(private pranService: PlanService) {}

  @Post('create')
  create(@CurrentUser('sub') userId: number, @Body() dto: CreateDto) {
    return this.pranService.create(userId, dto.tasks);
  }
}
