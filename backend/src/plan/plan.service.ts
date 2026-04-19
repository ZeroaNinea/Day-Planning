import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Plan } from '../entities/plan.entity';
import { TaskDto } from './dto/task.dto';
import { CreateDto } from './dto/create.dto';

import { TimeSlot } from '../../types/time-slot.alias';

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

  private toTimeString(minutes: number): string {
    const h = Math.floor(minutes / 60)
      .toString()
      .padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  private getEnergySlots(): TimeSlot[] {
    return [
      { start: 9 * 60, end: 12 * 60, energy: 'high' },
      { start: 12 * 60, end: 18 * 60, energy: 'medium' },
      { start: 18 * 60, end: 22 * 60, energy: 'low' },
    ];
  }

  private matchesEnergy(task: TaskDto, slot: TimeSlot): boolean {
    if (task.effort === 'low') return true;
    if (task.effort === 'medium') return slot.energy !== 'low';
    if (task.effort === 'high') return slot.energy === 'high';
    return false;
  }

  async create(userId: number, dto: CreateDto) {
    this.validateTasks(dto.tasks);

    const plan = this.planRepository.create({
      user: { id: userId },
      title: dto.title,
      date: new Date().toISOString().split('T')[0],
      tasks: dto.tasks,
    });

    return this.planRepository.save(plan);
  }

  async update(id: number, userId: number, tasks: TaskDto[]) {
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

  async autoSchedule(id: number, userId: number) {
    const plan = await this.planRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!plan) {
      throw new NotFoundException(' X_X Plan not found.');
    }

    this.validateTasks(plan.tasks);

    const tasks = [...plan.tasks];

    // Sort: priority DESC, effort DESC.
    const effortOrder = { high: 3, medium: 2, low: 1 };

    tasks.sort((a, b) => {
      const pA = a.priority ?? 0;
      const pB = b.priority ?? 0;

      if (pA !== pB) return pB - pA;

      return effortOrder[b.effort] - effortOrder[a.effort];
    });

    const slots = this.getEnergySlots();
    const scheduled: TaskDto[] = [];

    for (const task of tasks) {
      let placed = false;

      // 1. Try matching energy slot first.
      for (const slot of slots) {
        if (
          this.matchesEnergy(task, slot) &&
          slot.end - slot.start >= task.duration
        ) {
          const start = slot.start;
          const end = start + task.duration;

          scheduled.push({
            ...task,
            start: this.toTimeString(start),
            end: this.toTimeString(end),
          });

          slot.start = end; // Shrink slot.
          placed = true;
          break;
        }
      }

      // 2. Fallback: place anywhere.
      if (!placed) {
        for (const slot of slots) {
          if (slot.end - slot.start >= task.duration) {
            const start = slot.start;
            const end = start + task.duration;

            scheduled.push({
              ...task,
              start: this.toTimeString(start),
              end: this.toTimeString(end),
            });

            slot.start = end;
            placed = true;
            break;
          }
        }
      }

      // 3. If still not placed — skip.
      // if (!placed) {}
    }

    plan.tasks = scheduled;

    return this.planRepository.save(plan);
  }
}
