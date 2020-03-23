import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import HealthController from './interfaces/health/health.controller';
import KeyManagementModule from './domain/key-management/key-management.module';
import { jsonResponse } from './middleware/jsonresponse.middleware';

@Module({
  imports: [
    KeyManagementModule,
  ],
  controllers: [
    HealthController,
  ],
  providers: [],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(jsonResponse);
  }
}
