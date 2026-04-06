import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from './users.service';
import { AuthService } from './auth.service';

import { SignupDto } from './dto/signup.dto';
import { UpdateDto } from './dto/update.dto';
import { DeleteDto } from './dto/delete.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() { username, password }: SignupDto) {
    return this.usersService.create({ username, password });
  }

  @Put('update')
  @UseGuards(AuthGuard('jwt'))
  async update(@Body() { id, username, password }: UpdateDto) {
    return this.usersService.update({ id, username, password });
  }

  @Delete('delete')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Body() { id, password }: DeleteDto) {
    return this.usersService.delete({ id, password });
  }

  @Post('login')
  async login(@Body() { username, password }: LoginDto) {
    return this.authService.login({ username, password });
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(
    @Request()
    req: {
      user: {
        id: string;
        email: string;
      };
    },
  ) {
    return req.user;
  }

  // @Post('refresh')
  // async refresh(@Body('refreshToken') token: string) {
  //   return this.authService.refresh(token);
  // }
}
