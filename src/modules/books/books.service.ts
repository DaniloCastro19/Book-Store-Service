import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import PrismaService from '../../common/infrastructure/services/prisma.service';

@Injectable()
export class BooksService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    return await this.prismaService.book.create({
      data: createBookDto,
    });
  }

  async findAll() {
    return await this.prismaService.book.findMany();
  }

  async findOne(id: string) {
    const book = await this.prismaService.book.findUnique({
      where: { id },
    });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async findByGoogleId(googleBooksId: string) {
    return await this.prismaService.book.findUnique({
      where: { googleBooksId },
    });
  }

  // Books with no loan with (without ACTIVE o OVERDUE state)
  async findAvailable() {
    const books = await this.prismaService.book.findMany({
      where: {
        loans: {
          none: {
            status: { in: ['ACTIVE', 'OVERDUE'] },
          },
        },
      },
    });
    return books;
  }

  // List currently loaned books (with ACTIVE or OVERDUE status)
  async findLoaned() {
    return await this.prismaService.book.findMany({
      where: {
        loans: {
          some: {
            status: { in: ['ACTIVE', 'OVERDUE'] },
          },
        },
      },
    });
  }

  // Creates a book only if googleBookId doesn't exist.
  async upsertFromGoogleData(dto: CreateBookDto) {
    const { googleBooksId, title, authors, description, coverImage, category } =
      dto;

    const existing = await this.prismaService.book.findUnique({
      where: { googleBooksId },
    });
    if (existing) {
      throw new BadRequestException(
        'Book with this Google Books ID already exists',
      );
    }

    return await this.prismaService.book.create({
      data: {
        googleBooksId,
        title,
        authors,
        description,
        coverImage,
        category,
      },
    });
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.prismaService.book.findUnique({
      where: { id },
    });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return await this.prismaService.book.update({
      where: { id },
      data: updateBookDto,
    });
  }

  async remove(id: string) {
    // TODO: Check if the book don't have any active or overdue loan before deleting
    const book = await this.prismaService.book.findUnique({
      where: { id },
    });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return this.prismaService.book.delete({
      where: { id },
    });
  }
}
