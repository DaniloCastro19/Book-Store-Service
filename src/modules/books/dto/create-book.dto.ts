import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsUrl } from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  googleBooksId!: string;

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
}
