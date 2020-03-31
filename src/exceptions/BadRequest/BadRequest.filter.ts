import { BaseExceptionFilter } from '@nestjs/core';
import { Logger, ArgumentsHost, BadRequestException, Catch } from '@nestjs/common';
import { BAD_REQUEST } from 'http-status';
import { Response } from 'express';

@Catch(BadRequestException)
export default class BadRequestExceptionFilter extends BaseExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
    
        Logger.error(exception);
    
        response.jsonResponse(null, exception['response']['message'], false, BAD_REQUEST);
      }
}