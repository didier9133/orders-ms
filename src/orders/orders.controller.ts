import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import {
  CreateOrderDto,
  PaginationOrderDTO,
  PaidOrderDTO,
  StatusOrderDTO,
} from './dto';

@Controller()
export class OrdersController {
  private readonly logger = new Logger('orderMS');
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('createOrder')
  async create(@Payload() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.create(createOrderDto);
    const paymentSession = await this.ordersService.createPaymentSession(order);

    return {
      order,
      paymentSession,
    };
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

  @EventPattern('payment.webhook.succeeded')
  paidOrder(@Payload() paidOrderDto: PaidOrderDTO) {
    return this.ordersService.paidOrder(paidOrderDto);
  }
}
