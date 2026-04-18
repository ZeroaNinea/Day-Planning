import { Injectable } from '@nestjs/common';
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

  create(userId: number, tasks: Task[]) {
    const plan = this.planRepository.create({
      user: { id: userId },
      date: new Date().toISOString().split('T')[0],
      tasks,
    });

    return this.planRepository.save(plan);
  }
}
