import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class TaskDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNotEmpty()
  @IsBoolean()
  isCompleted!: boolean;

  @IsNotEmpty()
  @IsNumber()
  duration!: number; // In minutes.

  @IsNotEmpty()
  @IsString()
  effort!: 'low' | 'medium' | 'high';

  @IsNumber()
  @IsOptional()
  priority?: number;

  @IsNumber()
  @IsOptional()
  start?: string;

  @IsNumber()
  @IsOptional()
  end?: string;
}
