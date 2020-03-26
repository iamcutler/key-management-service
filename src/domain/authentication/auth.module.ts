import { Module, MiddlewareConsumer, HttpModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthorizationMiddleware } from './middleware/authorization.middleware';
import KeyManagementController from '../../interfaces/key-management/key-management.controller';
import { AuthService } from './services/auth/auth.service';

@Module({
    imports: [
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
          .forRoutes(KeyManagementController);
    }
}
