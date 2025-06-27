import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty({message: 'Conversation ID cannot be empty' })
  conversationId: string;

  @IsString()
  senderId: string;

  @IsString()
  @IsNotEmpty({message: 'Content cannot be empty' })
  content: string;
}
