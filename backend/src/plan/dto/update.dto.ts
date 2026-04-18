import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer/types/decorators';
import { TaskDto } from './task.dto';

export class UpdateDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskDto)
  tasks!: TaskDto[];
}
