import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageDocument } from './message.schema';
import { KafkaService } from '../kafka/kafka.service';
import { kafkaConfig } from '../kafka/kafka.config';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<MessageDocument>,
    private readonly kafkaService: KafkaService,
    private readonly elasticsearchService: ElasticsearchService,
  ) { }

  async createMessage(createMessageDto: CreateMessageDto) {
    try {
      const message = await this.messageModel.create({ ...createMessageDto, timestamp: new Date() });
      await this.elasticsearchService.indexMessage(message);
      await this.kafkaService.emit(kafkaConfig.topic.messageCreated, {
        id: 'message._id.toString()',
        conversationId: message.conversationId,
        senderId: message.senderId,
        content: message.content,
        timestamp: message.timestamp,
      });

      return {
        status: 'success',
        message: 'Message sent successfully',
      };
    } catch (error) {
      console.error('Error creating message:', error);
      return {
        status: 'Failed',
        message: 'Error creating message',
      };
    }
  }

  async getMessagesPaginated(
    conversationId: string,
    page: number,
    limit: number,
    sortField: string,
    sortOrder: 'asc' | 'desc',
  ) {
    try {
      const skip = (page - 1) * limit;
    const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 } as Record<string, 1 | -1>;

    const [messages, total] = await Promise.all([
      this.messageModel.find({ conversationId })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.messageModel.countDocuments({ conversationId })
    ]);

    return {
      status: 'success',
      data: messages,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return {
        status: 'Failed',
        message: 'Error fetching messages',
      };
    }
  }

  async searchMessages(conversationId: string, q: string) {
    try {
      const results = await this.elasticsearchService.searchMessages(conversationId, q);
      return {
        status: 'success',
        data:results
      };
    } catch (error) {
      console.error('Error searching messages:', error);
      return {
        status: 'Failed',
        message: 'Failed to search messages',
      }
    }
  }

}
