import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { BooksModule } from './modules/books/books.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoanModule } from './modules/loan/loan.module';

@Module({
  imports: [PrismaModule, UsersModule, BooksModule, AuthModule, LoanModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
