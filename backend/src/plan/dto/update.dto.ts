import { IsArray, ValidateNested, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskDto } from './task.dto';

export class UpdateDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskDto)
  tasks!: TaskDto[];
}
