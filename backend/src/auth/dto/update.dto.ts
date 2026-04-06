import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsEmail()
  @IsNotEmpty()
  username!: string;

  @IsString()
  password!: string;
}
