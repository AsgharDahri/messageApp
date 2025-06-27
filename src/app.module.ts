// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesModule } from './modules/messages/messages.module';
import { DatabaseModule } from './config/database/database.module';
import { ElasticsearchModule } from './modules/elasticsearch/elasticsearch.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URL as string),
    MessagesModule,
    DatabaseModule,
    ElasticsearchModule,
  ],
})
export class AppModule {}
