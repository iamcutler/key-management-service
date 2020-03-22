import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { jsonResponse } from './middleware/jsonresponse.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(jsonResponse);

  await app.listen(3000);
}
bootstrap();
