import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import PrismaService from '../../common/infrastructure/services/prisma.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { BooksService } from '../books/books.service';

@Injectable()
export class LoanService {
  constructor(
    private prismaService: PrismaService,
    private booksService: BooksService,
  ) {}

  async getAvailableBooks() {
    return this.booksService.findAvailable();
  }

  async getLoans() {
    return this.prismaService.loan.findMany();
  }

  async findLoansByUser(userId: string) {
    const loans = await this.prismaService.loan.findMany({
      where: { userId },
      include: {
        book: true, // Includes book info
      },
      orderBy: { loanDate: 'desc' },
    });
    return loans;
  }

  async findActiveLoanByBookId(bookId: string) {
    const loans = await this.prismaService.loan.findMany({
      where: { bookId, status: { in: ['ACTIVE', 'OVERDUE'] } },
      include: {
        book: true, // Includes book info
      },
      orderBy: { loanDate: 'desc' },
    });
    return loans;
  }

  async findActiveLoans() {
    const activeLoans = await this.prismaService.loan.findMany({
      where: {
        status: 'ACTIVE',
        returnDate: null,
      },
      include: {
        user: {
          select: { id: true, email: true, name: true, role: true },
        },
        book: true,
      },
      orderBy: { dueDate: 'asc' }, // First show loans that are due sooner
    });
    return activeLoans;
  }

  async findOverdueLoans() {
    const overdueLoans = await this.prismaService.loan.findMany({
      where: { status: 'OVERDUE' },
      include: {
        user: {
          select: { id: true, email: true, name: true, role: true },
        },
        book: true,
      },
      orderBy: { dueDate: 'asc' },
    });
    return overdueLoans;
  }

  async createLoan(dto: CreateLoanDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id: dto.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Ensure the book exist in DB (or create them with the provided data)
    const book = await this.booksService.upsertOrReturnFromGoogleData({
      googleBooksId: dto.googleBooksId,
      title: dto.title,
      authors: dto.authors,
      description: dto.description,
      coverImage: dto.coverImage,
      category: dto.category,
    });
    const existingActiveLoan = await this.prismaService.loan.findFirst({
      where: {
        bookId: book.id,
        status: { in: ['ACTIVE', 'OVERDUE'] },
      },
    });

    // If there's an active loan for this book, prevent creating a new one
    if (existingActiveLoan) {
      throw new ConflictException(
        'This book is currently loaned and not yet returned',
      );
    }

    // Create the loan
    const loanDate = new Date();
    const dueDate = dto.dueDate
      ? new Date(dto.dueDate)
      : new Date(loanDate.getTime() + 14 * 24 * 60 * 60 * 1000); //14 days from now if not provided

    const loan = await this.prismaService.loan.create({
      data: {
        userId: dto.userId,
        bookId: book.id,
        loanDate,
        dueDate,
        status: 'ACTIVE',
      },
      include: {
        book: true,
        user: { select: { id: true, email: true, name: true } },
      },
    });
    return loan;
  }

  async returnLoan(loanId: string, userId: string) {
    const loan = await this.prismaService.loan.findUnique({
      where: { id: loanId },
      include: { book: true },
    });
    if (!loan) throw new NotFoundException('Loan not found');
    if (loan.status === 'RETURNED')
      throw new BadRequestException('Loan already returned');
    if (loan.userId !== userId) throw new ForbiddenException('Not your loan');

    return this.prismaService.loan.update({
      where: { id: loanId },
      data: {
        returnDate: new Date(),
        status: 'RETURNED',
      },
    });
  }
}
