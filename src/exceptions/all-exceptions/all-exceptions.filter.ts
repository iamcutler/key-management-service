import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';
import { BaseExceptionFilter } from '@nestjs/core';
import { INTERNAL_SERVER_ERROR } from 'http-status';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    Logger.error({
        message: 'Internal Server Error',
        timestamp: new Date().toISOString(),
        exception,
    });

    response.jsonResponse(null, ['Internal Server Error'], false, INTERNAL_SERVER_ERROR);
  }
}
