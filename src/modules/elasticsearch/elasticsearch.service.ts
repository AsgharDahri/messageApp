// src/elasticsearch/elasticsearch.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ElasticsearchService {
  private readonly client: Client;
  private readonly logger = new Logger(ElasticsearchService.name);

  constructor(private configService: ConfigService) {
    const nodeUrl = this.configService.get<string>('ES_NODE_URL', 'https://localhost:9200');

    this.client = new Client({
      node: this.configService.get<string>('ES_NODE_URL', 'https://localhost:9200'),
      auth: {
        username: 'elastic',
        password: process.env.ELASTIC_PASSWORD!,
      },

      tls: { rejectUnauthorized: false } // since using self-signed cert
    });

    this.logger.log(`✅ Connected to Elasticsearch at ${nodeUrl}`);
  }

  async ping(): Promise<boolean> {
    try {
      await this.client.ping();
      this.logger.log('✅ Elasticsearch ping OK');
      return true;
    } catch (error) {
      this.logger.error('❌ Elasticsearch ping failed', error);
      return false;
    }
  }

  async indexMessage(message: {
    conversationId: string;
    senderId: string;
    content: string;
    timestamp: Date;
  }) {
    const { conversationId, senderId, content, timestamp } = message;
    await this.client.index({
      index: 'messages_index',
      body: {
        conversationId,
        senderId,
        content,
        timestamp,
      },
      refresh: 'wait_for',
    });

    this.logger.log(`✅ Indexed message into Elasticsearch: ${conversationId}`);
  }
  async searchMessages(conversationId: string, q: string) {
    const { hits } = await this.client.search({
      index: 'messages_index',
      body: {
        query: {
          bool: {
            must: [
              { match: { content: q } },
              { term: { conversationId } }
            ],
          },
        },
      },
    });

    return hits.hits.map((hit) => hit._source);
  }
}
