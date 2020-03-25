import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { jsonResponse } from './middleware/jsonresponse.middleware';

import HealthController from './interfaces/health/health.controller';

import AuthModule from './domain/authentication/auth.module';
import KeyManagementModule from './domain/key-management/key-management.module';

@Module({
  imports: [
    AuthModule,
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
