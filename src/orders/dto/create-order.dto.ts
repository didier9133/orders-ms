import { Type } from 'class-transformer';
import { IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { CreateOrderItemDto } from '.';

// const OrderStatusList = [
//   OrderStatus.PENDING,
//   OrderStatus.CONFIRMED,
//   OrderStatus.CANCELLED,
// ];

// export class CreateOrderDto {
//   @IsNumber()
//   @IsPositive()
//   readonly total: number;

//   @IsEnum(OrderStatusList, {
//     message: `Invalid status, availables are ${OrderStatusList}`,
//   })
//   @IsOptional()
//   readonly status: OrderStatus = OrderStatus.PENDING;

//   @IsBoolean()
//   readonly paid: boolean = false;
// }

export class CreateOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
