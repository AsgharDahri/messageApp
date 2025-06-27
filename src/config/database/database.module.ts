import { Module, OnModuleInit } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Module({})
export class DatabaseModule implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit() {
    if (this.connection.readyState === 1) {
      console.log('MongoDB is connected successfully');
    } else {
      console.error('MongoDB is not connected. State:', this.connection.readyState);
    }

    this.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    this.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected.');
    });
  }
}
