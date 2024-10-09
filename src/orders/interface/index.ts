import { OrderStatus } from '@prisma/client';

export interface IOrder {
  data: {
    totalItems: number;
    orderItems: {
      productName: any;
      productId: string;
      quantity: number;
      price: number;
    }[];
    id: string;
    createdAt: Date;
    updatedAt: Date;
    total: number;
    status: OrderStatus;
    paid: boolean;
    paidAt: Date | null;
  };
}
