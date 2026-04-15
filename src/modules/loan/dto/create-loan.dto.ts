import {
  IsString,
  IsArray,
  IsOptional,
  IsDateString,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoanDto {
  @ApiProperty()
  @IsString()
  googleBooksId!: string;

  @ApiProperty()
  @IsString()
  userId!: string;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  authors!: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  coverImage?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
