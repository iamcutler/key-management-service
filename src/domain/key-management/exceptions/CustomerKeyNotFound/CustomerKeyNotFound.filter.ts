import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';
import CustomerKeyNotFoundException from './CustomerKeyNotFound.exception';

@Catch(CustomerKeyNotFoundException)
export class CustomerKeyNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: CustomerKeyNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    Logger.error(exception);

    response.jsonResponse(null, [exception.message], false, status);
  }
}
