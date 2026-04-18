import { Controller, UseGuards, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PlanService } from './plan.service';

@Controller('plan')
export class PlanController {
  constructor(private pranService: PlanService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  create() {}
}
