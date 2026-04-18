import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import { User } from './user.entity';

@Entity()
export class Plan {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  title?: string;

  @Column()
  date?: string;

  @Column({ type: 'json' })
  tasks?: {
    title: string;
    start: string;
    end: string;
  }[];

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user?: User;

  @CreateDateColumn()
  createdAt?: Date;
}
