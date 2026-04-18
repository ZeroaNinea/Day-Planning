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
  id?: number;

  @Column()
  title?: string;

  @Column()
  date?: string;

  @Column({ type: 'json' })
  tasks?: TaskDto[];

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user?: User;

  @CreateDateColumn()
  createdAt?: Date;
}
