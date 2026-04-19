import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import { User } from './user.entity';
import { TaskDto } from '../plan/dto/task.dto';

@Entity()
export class Plan {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  date!: string;

  @Column({ type: 'json' })
  tasks!: TaskDto[];

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user!: User;

  @Column()
  isCompleted?: boolean;

  @Column()
  effort?: 'low' | 'medium' | 'high';

  @Column()
  duration?: number;

  @Column()
  start?: string;

  @Column()
  end?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
