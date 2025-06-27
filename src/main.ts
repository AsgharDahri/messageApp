import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ElasticsearchService } from './modules/elasticsearch/elasticsearch.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,         // Strip unknown properties
      forbidNonWhitelisted: true,
      transform: true,         // Auto-transform payloads to DTO types
      disableErrorMessages: false, // <-- enables validation messages
    }),
  );
  const esService = app.get(ElasticsearchService);
await esService.ping();
  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
