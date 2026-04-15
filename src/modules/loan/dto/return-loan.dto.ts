import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReturnLoanDto {
  @ApiProperty()
  @IsString()
  userId!: string;
}
