import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { jsonResponse } from './middleware/jsonresponse.middleware';
// controllers
import HealthController from './interfaces/health/health.controller';
// modules
import AuthModule from './domain/authentication/auth.module';
import KeyManagementModule from './domain/key-management/key-management.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    KeyManagementModule,
    TerminusModule,
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
