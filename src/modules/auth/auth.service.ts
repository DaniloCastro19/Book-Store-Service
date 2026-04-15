import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginResponse, UserRegisterResponse } from './dto/response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<LoginResponse> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return {
        message: 'Invalid credentials',
        access_token: undefined,
      };
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      return {
        message: 'Invalid credentials',
        access_token: undefined,
      };
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    return {
      message: 'Login successful',
      payload: payload,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(
    email: string,
    pass: string,
    name: string,
  ): Promise<UserRegisterResponse> {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      return {
        message: 'Email already in use',
        user: undefined,
      };
    }

    if (pass.length < 6) {
      return {
        message: 'Password must be at least 6 characters long',
        user: undefined,
      };
    }

    const hashedPassword = await bcrypt.hash(pass, 10);
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
    });

    if (!user) {
      return {
        message: 'User registration failed. Internal error occurred.',
        user: undefined,
      };
    }

    return {
      message: 'User Registered successfully',
      user: {
        email: user.email,
        name: user.name ?? '',
      },
    };
  }
}
