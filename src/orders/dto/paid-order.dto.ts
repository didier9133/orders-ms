import { IsString, IsUrl, IsUUID } from 'class-validator';

export class PaidOrderDTO {
  @IsString()
  @IsUUID()
  orderId: string;

  @IsString()
  idStripe: string;

  @IsString()
  @IsUrl()
  urlReceiptStripe: string;
}
