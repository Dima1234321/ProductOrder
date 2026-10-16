import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Max, MaxLength, Min } from 'class-validator';

const trimString = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateOrderItemDto {
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  code_product!: string;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  code_category!: string;

  @Transform(trimString)
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