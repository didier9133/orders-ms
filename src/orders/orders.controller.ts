import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto, PaginationOrderDTO, StatusOrderDTO } from './dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('createOrder')
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern('findAllOrders')
  findAll(@Payload() paginationOrderDTO: PaginationOrderDTO) {
    return this.ordersService.findAll(paginationOrderDTO);
  }

  @MessagePattern('findOneOrder')
  findOne(@Payload() id: string) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern('changeOrderStatus')
  update(@Payload() statusOrderDTO: StatusOrderDTO) {
    return this.ordersService.updateStatus({
      ...statusOrderDTO,
    });
  }
}
