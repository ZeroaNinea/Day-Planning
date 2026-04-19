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
// import { TaskDto } from './dto/task.dto';
import { UpdateDto } from './dto/update.dto';

@Controller('plan')
@UseGuards(AuthGuard('jwt'))
export class PlanController {
  constructor(private planService: PlanService) {}

  @Post('create')
  async create(@CurrentUser('sub') userId: number, @Body() dto: CreateDto) {
    return this.planService.create(userId, dto);
  }

  @Put('update/:id')
  async update(
    @CurrentUser('sub') userId: number,
    @Body() dto: UpdateDto,
    @Param('id') id: string,
  ) {
    return this.planService.update(Number(id), userId, dto);
  }

  @Get('read-all')
  async readAll(@CurrentUser('sub') userId: number) {
    return this.planService.readAll(userId);
  }

  @Get('read')
  async read(@CurrentUser('sub') userId: number, @Body() dto: { id: number }) {
    return this.planService.read(userId, dto.id);
  }

  @Delete(':id')
  async delete(@CurrentUser('sub') userId: number, @Param('id') id: string) {
    return this.planService.delete(Number(id), userId);
  }

  @Patch('auto-schedule')
  async autoSchedule(
    @CurrentUser('sub') userId: number,
    @Body() dto: { id: number },
  ) {
    return this.planService.autoSchedule(dto.id, userId);
  }
}
