import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponse } from './order.types';
export declare class OrdersService implements OnModuleInit, OnModuleDestroy {
    private readonly elasticsearch;
    private readonly index;
    constructor(elasticsearch: Client, config: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    findAll(): Promise<OrderResponse[]>;
    create(order: CreateOrderDto): Promise<OrderResponse>;
}
