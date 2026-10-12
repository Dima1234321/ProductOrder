import { CreateOrderItemDto } from './create-order-item.dto';
export declare class CreateOrderDto {
    first_name: string;
    last_name: string;
    address: string;
    mail: string;
    items: CreateOrderItemDto[];
}
