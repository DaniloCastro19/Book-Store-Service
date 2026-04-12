import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsOptional,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  googleBooksId!: string;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  authors!: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  totalStock?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  availableStock?: number;
}
