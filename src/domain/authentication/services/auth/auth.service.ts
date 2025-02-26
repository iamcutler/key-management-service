import { Injectable, HttpService } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import AuthTokenException from '../../expectations/AuthTokenException/AuthToken.exception';
import AuthenticationException from '../../expectations/Authentication/Authentication.exception';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly http: HttpService,
        private readonly configService: ConfigService
    ) {}

    /**
     * Authenticate a user by token
     *
     * @param tenantId
     * @param token
     */
    async authenticateByToken(tenantId: string, token: string) {
        try {
            return await this.http.get('/v1/usermanagement/users/self', {
                headers: {
                    'x-authorization': token,
                }
            }).toPromise();
        }
        catch (err) {
            throw new AuthenticationException(`Authentication failed for tenant: ${tenantId}`);
        }
    }

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
