import { BaseExceptionFilter } from '@nestjs/core';
import { ArgumentsHost, Logger, Catch } from '@nestjs/common';
import AuthenticationException from './Authentication.exception';

@Catch(AuthenticationException)
export class AuthenticationExceptionFilter extends BaseExceptionFilter {
    catch(exception: AuthenticationException, host: ArgumentsHost) {
        const cxt = host.switchToHttp();
        const response = cxt.getResponse();
        const status = exception.getStatus();

        Logger.error(exception);

        response.jsonResponse(null, [exception.message], false, status);
    }
}
