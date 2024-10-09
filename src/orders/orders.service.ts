import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CreateOrderDto,
  PaginationOrderDTO,
  PaidOrderDTO,
  StatusOrderDTO,
} from './dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IOrder } from './interface';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('NATS_SERVICE') private client: ClientProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      const productsIds = createOrderDto.items.map(
        (product) => product.productId,
      );
      const productsFound: any[] = await firstValueFrom(
        this.client.send({ cmd: 'validateProduct' }, productsIds),
      );

      const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
        const priceProduct = productsFound.find(
          (product) => product.id === orderItem.productId,
        ).price;

        return (acc += priceProduct * orderItem.quantity);
      }, 0);

      const totalItems = createOrderDto.items.reduce((acc, orderItem) => {
        return (acc += orderItem.quantity);
      }, 0);

      const order = await this.prisma.order.create({
        data: {
          total: totalAmount,
          orderItems: {
            createMany: {
              data: createOrderDto.items.map((orderItem) => {
                return {
                  quantity: orderItem.quantity,
                  productId: orderItem.productId.toString(),
                  price: productsFound.find(
                    (product) => product.id === orderItem.productId,
                  ).price,
                };
              }),
            },
          },
        },
        include: {
          orderItems: {
            select: {
              quantity: true,
              price: true,
              productId: true,
            },
          },
        },
      });

      return {
        data: {
          ...order,
          totalItems,
          orderItems: order.orderItems.map((orderItem) => {
            return {
              ...orderItem,
              productName: productsFound.find(
                (product) => product.id === Number(orderItem.productId),
              ).name,
            };
          }),
        },
      };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async findAll(paginationOrderDTO: PaginationOrderDTO) {
    const { limit, status, page } = paginationOrderDTO;
    const totalOders = await this.prisma.order.count({
      where: {
        status,
      },
    });

    const orders = await this.prisma.order.findMany({
      where: {
        status,
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: orders,
      totalPages: Math.ceil(totalOders / limit),
      currentPage: page,
      totalOders,
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          select: {
            quantity: true,
            price: true,
            productId: true,
          },
        },
      },
    });

    if (!order) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Order not found',
      });
    }

    const productsIds = order.orderItems.map(
      (orderItem) => +orderItem.productId,
    );
    const productsFound: any[] = await firstValueFrom(
      this.client.send({ cmd: 'validateProduct' }, productsIds),
    );

    return {
      ...order,
      orderItems: order.orderItems.map((orderItem) => {
        return {
          ...orderItem,
          productName: productsFound.find(
            (product) => product.id === Number(orderItem.productId),
          ).name,
        };
      }),
    };
  }

  async updateStatus(statusOrderDTO: StatusOrderDTO) {
    const { status, id } = statusOrderDTO;
    const order = await this.findOne(id);

    if (order.status === status) {
      return order;
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status,
      },
    });
  }

  async createPaymentSession(order: IOrder) {
    const paymentSession = await firstValueFrom(
      this.client.send('create.payment.session', {
        orderId: order.data.id,
        currency: 'usd',
        items: [
          {
            name: 'keyboard',
            price: 50,
            quantity: 2,
          },
          {
            name: 'laptop',
            price: 199.8,
            quantity: 2,
          },
        ],
      }),
    );

    return paymentSession;
  }

  async paidOrder(paidOrderDto: PaidOrderDTO) {
    const updatedOrder = await this.prisma.order.update({
      where: { id: paidOrderDto.orderId },
      data: {
        status: 'PAID',
        paid: true,
        paidAt: new Date(),
        stripeChargeId: paidOrderDto.idStripe,

        // la relacion de OrderReceipt
        OrderReceipt: {
          create: {
            receiptUrl: paidOrderDto.urlReceiptStripe,
          },
        },
      },
    });

    return updatedOrder;
  }
}
