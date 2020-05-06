import { Request, Response, NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http';
import { Injectable, NestMiddleware, UseFilters, Req, Res, Next } from '@nestjs/common';
import AuthTokenException from '../expectations/AuthTokenException/AuthToken.exception';
import { AuthService } from '../services/auth/auth.service';
import { AuthenticationExceptionFilter } from '../expectations/Authentication/Authentication.exception.filter';
import { ConfigService } from '@nestjs/config';

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
   constructor(
      private readonly authService: AuthService,
      private readonly configService: ConfigService
   ) {}

   async use(
      @Req() req: Request, @Res() res: Response, @Next() next: NextFunction
   ) {
      const headers: IncomingHttpHeaders = req.headers;
      // get token and decode or any custom auth logic
      const tenant = headers.authorization;
      // Check if the authorization header is set
      if (!tenant) throw new AuthTokenException('No authorization token or tenant was present');

      await this.authenticate(tenant, req);

      req.tenantId = tenant;
      next();
   }

   /**
    * Authenticate the JWT token via the identity service
    *
    * @param token
    * @param req
    */
   private async authenticate(token: string, @Req() req: Request): Promise<void> {
      // get the content from the token
      const tokenContent = this.authService.getContentFromAuthToken(token);
      req.token = tokenContent;
      req.tenantId = tokenContent['tenantUuid'];

      // call CR to authenticate via the JWT token
      await this.authService.authenticateByToken(tokenContent['tenantUuid'], token);
   }
}
