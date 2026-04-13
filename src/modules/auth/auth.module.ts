import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { loadEnvFile } from 'process';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from '../users/users.service';
loadEnvFile();

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, UsersService],
  exports: [AuthService, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
