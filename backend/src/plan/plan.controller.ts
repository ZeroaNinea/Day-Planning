import {
  Controller,
  UseGuards,
  Post,
  Get,
  Patch,
  Body,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CurrentUser } from '../common/decorators/user.decorator';
import { CreateDto } from './dto/create.dto';

import { PlanService } from './plan.service';
import { TaskDto } from './dto/task.dto';

@Controller('plan')
@UseGuards(AuthGuard('jwt'))
export class PlanController {
  constructor(private planService: PlanService) {}

  @Post('create')
  create(@CurrentUser('sub') userId: number, @Body() dto: CreateDto) {
    return this.planService.create(userId, dto.tasks);
  }

  @Put('update')
  update(
    @CurrentUser('sub') userId: number,
    @Body() dto: { id: number; tasks: TaskDto[] },
  ) {
    return this.planService.update(dto.id, userId, dto.tasks);
  }

  @Get('read-all')
  readAll(@CurrentUser('sub') userId: number) {
    return this.planService.readAll(userId);
  }

  @Get('read')
  read(@CurrentUser('sub') userId: number, @Body() dto: { id: number }) {
    return this.planService.read(userId, dto.id);
  }

  @Delete(':id')
  delete(@CurrentUser('sub') userId: number, @Param('id') id: string) {
    return this.planService.delete(Number(id), userId);
  }

  @Patch('auto-schedule')
  autoSchedule(
    @CurrentUser('sub') userId: number,
    @Body() dto: { id: number },
  ) {
    return this.planService.autoSchedule(dto.id, userId);
  }
}
