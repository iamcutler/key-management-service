import { Module, MiddlewareConsumer, HttpModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthorizationMiddleware } from './middleware/authorization.middleware';
import CustomerKeyManagementController from '../../interfaces/customerKeyManagement/customerKeyManagement.controller';
import DataKeyManagementController from '../../interfaces/DataKeyManagement/DataKeyManagement.controller';
import { AuthService } from './services/auth/auth.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
        HttpModule,
        JwtModule.register({ secret: 'hard!to-guess_secret' })
    ],
    providers: [
        AuthService,
    ],
})
export default class AuthModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(AuthorizationMiddleware)
          .forRoutes(
              CustomerKeyManagementController,
              DataKeyManagementController,
          );
    }
}
