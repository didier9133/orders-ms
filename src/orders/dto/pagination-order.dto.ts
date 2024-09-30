import { IsEnum, IsOptional } from 'class-validator';
import { PaginationProductsDto } from './pagination-product.dto';
import { OrderStatusList } from '../enums';
import { OrderStatus } from '@prisma/client';

export class PaginationOrderDTO extends PaginationProductsDto {
  @IsOptional()
  @IsEnum(OrderStatusList, {
    message: `Invalid status, availables are ${OrderStatusList}`,
  })
  public status?: OrderStatus;
}
