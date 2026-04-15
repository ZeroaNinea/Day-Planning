import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @MinLength(5)
  @IsString()
  @IsNotEmpty()
  password!: string;
}
