import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { SignupDto } from '../auth/dto/signup.dto';
import { UpdateDto } from '../auth/dto/update.dto';
import { DeleteDto } from '../auth/dto/delete.dto';
import { LoginDto } from '../auth/dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByUsername(username: string) {
    return this.usersRepository.findOne({
      where: { username },
    });
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async create({ username, email, password }: SignupDto) {
    const existingUser = await this.findByUsername(username);

    if (existingUser) {
      throw new ConflictException(' X_X User already exists.');
    }

    const hash = await bcrypt.hash(password, 12);

    const user = this.usersRepository.create({
      username,
      email,
      password: hash,
    });

    return this.usersRepository.save(user);
  }

  async update({ id, username, password }: UpdateDto) {
    const user = await this.usersRepository.findOne({
      where: { id: Number(id) },
    });

    if (!user) {
      throw new NotFoundException(' X_X User not found.');
    }

    const hash = await bcrypt.hash(password, 12);

    user.username = username;
    user.password = hash;

    return this.usersRepository.save(user);
  }

  async delete({ id, password }: DeleteDto) {
    const user = await this.usersRepository.findOne({
      where: { id: Number(id) },
    });

    if (!user) {
      throw new NotFoundException(' X_X User not found.');
    }

    const isValid = await bcrypt.compare(password, user.password || '');

    if (!isValid) {
      throw new UnauthorizedException(' X_X Invalid credentials.');
    }

    await this.usersRepository.remove(user);

    return { message: 'User deleted.' };
  }

  async validateUser({ email, password }: LoginDto) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException(' X_X User not found.');
    }

    const isValid = await bcrypt.compare(password, user.password || '');

    if (!isValid) {
      throw new UnauthorizedException(' X_X Invalid credentials.');
    }

    return user;
  }
}
