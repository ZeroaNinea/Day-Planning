import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskDto } from './task.dto';

export class CreateDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskDto)
  tasks!: TaskDto[];
}
