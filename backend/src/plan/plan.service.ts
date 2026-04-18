import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Plan } from '../entities/plan.entity';
import { Task } from '../../types/task.alias';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  async findAll(userId: number) {
    return this.planRepository.find({ where: { user: { id: userId } } });
  }

  async create(userId: number, tasks: Task[]) {
    if (!tasks.length) {
      throw new BadRequestException(' X_X Plan must contain tasks.');
    }

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
    await this.planRepository.delete({
      id,
      user: { id: userId },
    });
  }
}
