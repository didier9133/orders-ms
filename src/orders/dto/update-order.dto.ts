import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from '.';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  id: number;
}
