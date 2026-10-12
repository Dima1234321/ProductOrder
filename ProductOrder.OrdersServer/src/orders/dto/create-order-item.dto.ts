import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  code_product!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  code_category!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  descr_product!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  quantity!: number;
}
