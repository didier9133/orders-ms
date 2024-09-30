import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationProductsDto {
  
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  public limit?: number = 10;
  
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  public page?: number = 1;
}
