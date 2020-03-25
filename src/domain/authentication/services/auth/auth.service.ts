import { Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import AuthTokenException from '../../expectations/AuthTokenException/AuthToken.exception';

@Injectable()
export class AuthService {
    /**
     * Get the tenant id from the authentication token
     *
     * @param token
     */
    getContentFromAuthToken(token: string) {
        const jwt: JwtService = new JwtService({});
        const tokenContent = jwt.decode(token, { json: true });

        if (tokenContent && tokenContent.hasOwnProperty('tenantUuid')) {
            return tokenContent;
        }

        throw new AuthTokenException('token or tenant id was not found');
    }
}
