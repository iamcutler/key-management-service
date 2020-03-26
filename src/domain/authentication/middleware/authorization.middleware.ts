import { Request, Response, NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http';
import { Injectable, NestMiddleware, UseFilters } from '@nestjs/common';
import AuthTokenException from '../expectations/AuthTokenException/AuthToken.exception';
import { AuthService } from '../services/auth/auth.service';
import { AuthenticationExceptionFilter } from '../expectations/Authentication/Authentication.exception.filter';

/**
 * Validate the JWT Bearer token is present on the request
 *
 * @param req
 * @param res
 * @param next
 */
@Injectable()
@UseFilters(new AuthenticationExceptionFilter())
export class AuthorizationMiddleware implements NestMiddleware {
   constructor(private readonly authService: AuthService) {}

   async use(req: Request, res: Response, next: NextFunction) {
      // get token and decode or any custom auth logic
      const headers: IncomingHttpHeaders = req.headers;
      const token = headers.authorization;

      // Check if the authorization header is set
      if (!token) throw new AuthTokenException('No authorization token was present');

      // get the content from the token
      const tokenContent = this.authService.getContentFromAuthToken(token);
      req.token = tokenContent;
      req.tenantId = tokenContent['tenantUuid'];

      // call CR to authenticate via the JWT token
      await this.authService.authenticateByToken(tokenContent['tenantUuid'], token);

      next();
   }
}
