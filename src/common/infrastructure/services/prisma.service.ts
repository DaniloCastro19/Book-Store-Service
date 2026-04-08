import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../../prisma/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

@Injectable()
export default class PrismaService extends PrismaClient {
  constructor() {
    const connectionString = `${process.env.DATABASE_URL}`;
    const adapter = new PrismaPg(connectionString);
    super({ adapter });
  }
}
