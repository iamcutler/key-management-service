import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { jsonResponse } from './middleware/jsonresponse.middleware';
import { AllExceptionsFilter } from './exceptions/all-exceptions/all-exceptions.filter';
import { AuthTokenExceptionFilter } from './domain/authentication/expectations/AuthTokenException/AuthToken.exception.filter';
import BadRequestExceptionFilter from './exceptions/BadRequest/BadRequest.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.use(jsonResponse);
  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapter),
    new AuthTokenExceptionFilter(),
    new BadRequestExceptionFilter(),
  );
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('Key Management Service')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
