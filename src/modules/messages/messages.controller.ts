// messages.controller.ts
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('api')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('/messages')
  async create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.createMessage(createMessageDto);
  }

   @Get('/conversations/:conversationId/messages/search')
  async searchMessages(
    @Param('conversationId') conversationId: string,
    @Query('q') q: string,
  ) {
    return this.messagesService.searchMessages(conversationId, q);
  }
  
  @Get('/conversations/:conversationId/messages')
  async getMessages(
    @Param('conversationId') conversationId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortField') sortField = 'timestamp',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    return this.messagesService.getMessagesPaginated(
      conversationId,
      Number(page),
      Number(limit),
      sortField,
      sortOrder,
    );
  }
}
