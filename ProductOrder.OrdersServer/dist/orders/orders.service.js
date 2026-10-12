"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const elasticsearch_1 = require("@elastic/elasticsearch");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const elasticsearch_constants_1 = require("../elasticsearch.constants");
let OrdersService = class OrdersService {
    elasticsearch;
    index;
    constructor(elasticsearch, config) {
        this.elasticsearch = elasticsearch;
        this.index = config.get('ELASTICSEARCH_INDEX', 'orders').toLowerCase();
    }
    async onModuleInit() {
        if (!/^[a-z0-9_-]+$/.test(this.index)) {
            throw new Error('ELASTICSEARCH_INDEX must be a valid lowercase Elasticsearch index name.');
        }
        const exists = await this.elasticsearch.indices.exists({ index: this.index });
        if (!exists) {
            const mapping = JSON.parse(await (0, promises_1.readFile)((0, node_path_1.join)(process.cwd(), 'orders.mapping.json'), 'utf8'));
            await this.elasticsearch.indices.create({ index: this.index, ...mapping });
            console.info(`Created Elasticsearch index "${this.index}" from orders.mapping.json.`);
        }
    }
    async onModuleDestroy() {
        await this.elasticsearch.close();
    }
    async findAll() {
        try {
            const result = await this.elasticsearch.search({
                index: this.index,
                size: 500,
                sort: [{ datetime: { order: 'desc' } }],
                query: { match_all: {} },
            });
            return result.hits.hits.flatMap((hit) => hit._source && hit._id ? [{ id: hit._id, ...hit._source }] : []);
        }
        catch {
            throw new common_1.InternalServerErrorException('Unable to retrieve orders from Elasticsearch.');
        }
    }
    async create(order) {
        const document = {
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
        }
        catch {
            throw new common_1.InternalServerErrorException('Unable to save the order to Elasticsearch.');
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(elasticsearch_constants_1.ELASTICSEARCH_CLIENT)),
    __metadata("design:paramtypes", [elasticsearch_1.Client,
        config_1.ConfigService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map