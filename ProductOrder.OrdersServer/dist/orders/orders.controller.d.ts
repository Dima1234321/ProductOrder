import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponse } from './order.types';
import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    findAll(): Promise<OrderResponse[]>;
    create(order: CreateOrderDto): Promise<OrderResponse>;
}
