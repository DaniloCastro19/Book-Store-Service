import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@ApiTags('books')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: 'List all books (no filters)' })
  findAll() {
    return this.booksService.findAll();
  }

  @Get('available')
  @ApiOperation({
    summary: 'List books that are currently available (no active/overdue loan)',
  })
  async findAvailable() {
    return this.booksService.findAvailable();
  }

  @Get('loaned')
  @ApiOperation({
    summary: 'List books that are currently loaned (active or overdue)',
  })
  async findLoaned() {
    return this.booksService.findLoaned();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get book by internal ID' })
  async findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Get('google/:googleId')
  @ApiOperation({ summary: 'Get book by Google Books ID' })
  async findByGoogleId(@Param('googleId') googleId: string) {
    return this.booksService.findByGoogleId(googleId);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new book' })
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing book' })
  async update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.booksService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a book. Fails if book has active/overdue loan.',
  })
  async remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
