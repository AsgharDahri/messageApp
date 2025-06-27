import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './message.schema';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { KafkaModule } from '../kafka/kafka.module';
import { ElasticsearchModule } from 'src/modules/elasticsearch/elasticsearch.module';

@Module({
   imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    KafkaModule,
        ElasticsearchModule
  ],
  
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
