import { Module } from '@nestjs/common';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { BooksService } from '../books/books.service';

@Module({
  controllers: [LoanController],
  providers: [LoanService, BooksService],
  exports: [LoanService],
})
export class LoanModule {}
