import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
