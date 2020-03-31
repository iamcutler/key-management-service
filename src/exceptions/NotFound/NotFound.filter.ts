import { BaseExceptionFilter } from '@nestjs/core';
import { Logger, ArgumentsHost, NotFoundException, Catch } from '@nestjs/common';
import { NOT_FOUND } from 'http-status';
import { Response } from 'express';

@Catch(NotFoundException)
export default class NotFoundExceptionFilter extends BaseExceptionFilter {
    catch(exception: NotFoundException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
    
        Logger.error(exception);
    
        response.jsonResponse(null, exception['response']['message'], false, NOT_FOUND);
      }
}
