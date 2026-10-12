import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponse } from './order.types';
import { OrdersService } from './orders.service';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(): Promise<OrderResponse[]> {
    return this.ordersService.findAll();
  }

  @Post()
  create(@Body() order: CreateOrderDto): Promise<OrderResponse> {
    return this.ordersService.create(order);
  }
}
