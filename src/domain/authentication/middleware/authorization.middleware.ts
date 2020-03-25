import { Request, Response, NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http';
import { Injectable, NestMiddleware } from '@nestjs/common';
import AuthTokenException from '../expectations/AuthTokenException/AuthToken.exception';
import { AuthService } from '../services/auth/auth.service';

/**
 * Validate the JWT Bearer token is present on the request
 *
 * @param req
 * @param res
 * @param next
 */
@Injectable()
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

      next();
   }
}
