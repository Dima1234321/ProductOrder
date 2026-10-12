import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';
import { ELASTICSEARCH_CLIENT } from './elasticsearch.constants';

@Global()
@Module({
  providers: [
    {
      provide: ELASTICSEARCH_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Client => {
        const node = config.get<string>('ELASTICSEARCH_URL', 'http://localhost:9200');
        const username = config.get<string>('ELASTICSEARCH_USERNAME');
        const password = config.get<string>('ELASTICSEARCH_PASSWORD');
        const options: ConstructorParameters<typeof Client>[0] = { node };

        if (username && password) {
          options.auth = { username, password };
        }

        return new Client(options);
      },
    },
  ],
  exports: [ELASTICSEARCH_CLIENT],
})
export class ElasticsearchModule {}