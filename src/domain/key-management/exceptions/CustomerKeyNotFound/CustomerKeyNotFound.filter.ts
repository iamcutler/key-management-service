import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import CustomerKeyNotFoundException from './CustomerKeyNotFound.exception';

@Catch(CustomerKeyNotFoundException)
export class CustomerKeyNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: CustomerKeyNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    Logger.error(exception);

    response.jsonResponse(null, [exception.message], false, status);
  }
}