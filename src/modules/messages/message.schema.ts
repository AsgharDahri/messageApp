import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true, index: true })
  conversationId: string;

  senderId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, default: true })
  status: boolean;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export type MessageDocument = Message & Document;
export const MessageSchema = SchemaFactory.createForClass(Message);
