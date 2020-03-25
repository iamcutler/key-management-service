import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';
import AuthTokenException from './AuthToken.exception';

@Catch(AuthTokenException)
export class AuthTokenExceptionFilter implements ExceptionFilter {
  catch(exception: AuthTokenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    Logger.error(exception);

    response.jsonResponse(null, [exception.message], false, status);
  }
}
