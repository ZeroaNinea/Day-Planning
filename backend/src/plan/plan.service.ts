import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Plan } from '../entities/plan.entity';
import { Task } from '../../types/task.alias';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  private validateTasks(tasks?: TaskDto[]) {
    if (!tasks?.length) {
      throw new BadRequestException(' X_X Plan must contain tasks.');
    }

    const totalDuration = tasks.reduce(
      (sum, task) => sum + (task.duration ?? 0),
      0,
    );

    if (totalDuration > 24 * 60) {
      throw new BadRequestException(' X_X Tasks exceed one day.');
    }
  }

  async create(userId: number, tasks: TaskDto[] | undefined) {
    this.validateTasks(tasks);

    const plan = this.planRepository.create({
      user: { id: userId },
      date: new Date().toISOString().split('T')[0],
      tasks,
    });

    return this.planRepository.save(plan);
  }

  async update(id: number, userId: number, tasks: Task[]) {
    const plan = await this.planRepository.findOne({
      where: { id, user: { id: userId } },
    });

    this.validateTasks(tasks);

    if (!plan) {
      throw new NotFoundException(' X_X Plan not found.');
    }

    plan.tasks = tasks;

    return this.planRepository.save(plan);
  }

  async read(userId: number, id: number) {
    const plan = await this.planRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!plan) {
      throw new NotFoundException(' X_X Plan not found.');
    }

    return plan;
  }

  async readAll(userId: number) {
    return this.planRepository.find({ where: { user: { id: userId } } });
  }

  async delete(id: number, userId: number) {
    const plan = await this.planRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!plan) {
      throw new NotFoundException(' X_X Plan not found.');
    }

    await this.planRepository.remove(plan);
  }
}
