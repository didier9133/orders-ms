import { IsEnum, IsUUID } from 'class-validator';
import { OrderStatusList } from '../enums';
import { OrderStatus } from '@prisma/client';

export class StatusOrderDTO {
  @IsEnum(OrderStatusList, {
    message: `Invalid status, availables are ${OrderStatusList}`,
  })
  status: OrderStatus;

  @IsUUID(4)
  id: string;
}
