import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../prisma.service';
import { NatsModule } from 'src/nats/nats.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService],
  imports: [NatsModule],
})
export class OrdersModule {}
