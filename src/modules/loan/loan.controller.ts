import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Put,
} from '@nestjs/common';
import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { ApiBearerAuth } from '@nestjs/swagger/dist/decorators/api-bearer.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ReturnLoanDto } from './dto/return-loan.dto';

@ApiTags('loans')
@Controller('loans')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Get('active')
  @ApiOperation({ summary: 'List all active loans' })
  async activeLoans() {
    return await this.loanService.findActiveLoans();
  }

  @Get('overdue')
  @ApiOperation({ summary: 'List all overdue loans' })
  async overdueLoans() {
    return await this.loanService.findOverdueLoans();
  }

  @Get()
  @ApiOperation({
    summary: 'List all loans',
  })
  async allLoans() {
    return await this.loanService.getLoans();
  }

  @Get('/:userId')
  @ApiOperation({ summary: 'Get all loans of the authenticated user' })
  async myLoans(@Param('userId') userId: string) {
    return this.loanService.findLoansByUser(userId);
  }

  @Get('book/:bookId/status')
  @ApiOperation({
    summary: 'Check if a specific book is available (no active/overdue loan)',
  })
  async getBookLoanStatus(@Param('bookId') bookId: string) {
    const activeLoan = await this.loanService.findActiveLoanByBookId(bookId);
    return {
      available: !activeLoan,
      currentLoan: activeLoan || null,
    };
  }

  @Post()
  @ApiOperation({
    summary:
      'Request a loan for a book. Creates the book automatically if it does not exist.',
  })
  async create(@Body() dto: CreateLoanDto) {
    return await this.loanService.createLoan(dto);
  }

  @Put(':id/return')
  @ApiOperation({
    summary: 'Return a loaned book (users can return their own)',
  })
  async returnLoan(@Param('id') id: string, @Body() dto: ReturnLoanDto) {
    return this.loanService.returnLoan(id, dto.userId);
  }
}
