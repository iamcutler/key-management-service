import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import KeyManagementProviderException from './KeyManagementProvider.exception';

@Catch(KeyManagementProviderException)
export class KeyManagementProviderExceptionFilter implements ExceptionFilter {
  catch(exception: KeyManagementProviderException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    Logger.error(exception);

    response.jsonResponse(null, [exception.message], false, status);
  }
}
