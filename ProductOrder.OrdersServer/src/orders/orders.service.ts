import { Inject, Injectable, InternalServerErrorException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ELASTICSEARCH_CLIENT } from '../elasticsearch.constants';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDocument, OrderResponse } from './order.types';

@Injectable()
export class OrdersService implements OnModuleInit, OnModuleDestroy {
  private readonly index: string;

  constructor(
    @Inject(ELASTICSEARCH_CLIENT) private readonly elasticsearch: Client,
    config: ConfigService,
  ) {
    this.index = config.get<string>('ELASTICSEARCH_INDEX', 'orders').toLowerCase();
  }

  async onModuleInit(): Promise<void> {
    if (!/^[a-z0-9_-]+$/.test(this.index)) {
      throw new Error('ELASTICSEARCH_INDEX must be a valid lowercase Elasticsearch index name.');
    }

    const exists = await this.elasticsearch.indices.exists({ index: this.index });
    if (!exists) {
      const mapping = JSON.parse(await readFile(join(process.cwd(), 'orders.mapping.json'), 'utf8'));
      await this.elasticsearch.indices.create({ index: this.index, ...mapping });
      console.info(`Created Elasticsearch index "${this.index}" from orders.mapping.json.`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.elasticsearch.close();
  }

  async findAll(): Promise<OrderResponse[]> {
    try {
      const result = await this.elasticsearch.search<OrderDocument>({
        index: this.index,
        size: 500,
        sort: [{ datetime: { order: 'desc' } }],
        query: { match_all: {} },
      });

      return result.hits.hits.flatMap((hit) =>
        hit._source && hit._id ? [{ id: hit._id, ...hit._source }] : [],
      );
    } catch {
      throw new InternalServerErrorException('Unable to retrieve orders from Elasticsearch.');
    }
  }

  async create(order: CreateOrderDto): Promise<OrderResponse> {
    const document: OrderDocument = {
      first_name: order.first_name.trim(),
      last_name: order.last_name.trim(),
      address: order.address.trim(),
      mail: order.mail.trim().toLowerCase(),
      datetime: new Date().toISOString(),
      items: order.items.map((item) => ({
        code_product: item.code_product,
        code_category: item.code_category,
        descr_product: item.descr_product.trim(),
        quantity: item.quantity,
      })),
    };

    try {
      const result = await this.elasticsearch.index({
        index: this.index,
        document,
        refresh: 'wait_for',
      });

      return { id: result._id, ...document };
    } catch {
      throw new InternalServerErrorException('Unable to save the order to Elasticsearch.');
    }
  }
}
