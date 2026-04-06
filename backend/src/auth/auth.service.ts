import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

// import { Repository } from 'typeorm';
// import { User } from '../entities/user.entity';

import { LoginDto } from './dto/login.dto';
import { KeyStoreService } from './key-store.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private kid: string;
  private privateKey: Buffer;

  constructor(
    private jwtService: JwtService,
    private keyStore: KeyStoreService,
    private usersService: UsersService,
  ) {
    const { kid, privateKey } = this.keyStore.getCurrentPrivateKey();
    this.kid = kid;
    this.privateKey = privateKey;
  }

  private async issueTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = await this.jwtService.signAsync(payload, {
      privateKey: this.privateKey,
      algorithm: 'RS256',
      header: {
        alg: 'RS256',
        kid: this.kid,
      },
      expiresIn: '15m',
    });

    const refreshToken = crypto.randomBytes(64).toString('hex');
    // const tokenHash = await bcrypt.hash(refreshToken, 12);

    // await this.prisma.refreshToken.create({
    //   data: {
    //     tokenHash,
    //     userId,
    //     expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    //   },
    // });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.validateUser(dto);

    if (!user) {
      throw new UnauthorizedException(' X_X Invalid credentials.');
    }

    return this.issueTokens(String(user.id), user.username || '');
  }

  // async refresh(refreshToken: string) {
  //   const tokens = await this.prisma.refreshToken.findMany();

  //   let validToken!: {
  //     id: string;
  //     createdAt: Date;
  //     tokenHash: string;
  //     userId: string;
  //     expiresAt: Date;
  //   };

  //   for (const tokenRecord of tokens) {
  //     const match = await bcrypt.compare(refreshToken, tokenRecord.tokenHash);
  //     if (match) {
  //       validToken = tokenRecord;
  //       break;
  //     }
  //   }

  //   if (!validToken) {
  //     throw new UnauthorizedException('Invalid refresh token');
  //   }

  //   if (validToken.expiresAt < new Date()) {
  //     throw new UnauthorizedException('Refresh token expired');
  //   }

  //   // Rotate refresh token.
  //   await this.prisma.refreshToken.delete({
  //     where: { id: validToken.id },
  //   });

  //   const user = await this.prisma.user.findUnique({
  //     where: { id: validToken.userId },
  //   });

  //   if (!user) {
  //     throw new UnauthorizedException();
  //   }

  //   return this.issueTokens(user.id, user.email);
  // }
}
