import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
}
