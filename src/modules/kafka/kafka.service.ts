import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { kafkaConfig } from './kafka.config';

@Injectable()
export class KafkaService implements OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: kafkaConfig.brokers,
    });

    this.producer = this.kafka.producer();
    this.connect();
  }

  private async connect() {
    try {
      await this.producer.connect();
      console.log('Kafka producer connected successfully');
    } catch (error) {
      console.error('Failed to connect to Kafka:', error);
    }
  }

  async emit(topic: string, message: any) {
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key: message.id || Date.now().toString(),
            value: JSON.stringify(message),
          },
        ],
      });
      console.log(`Message published to topic: ${topic}`);
    } catch (error) {
      console.error(`Failed to publish message to topic ${topic}:`, error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }
} 