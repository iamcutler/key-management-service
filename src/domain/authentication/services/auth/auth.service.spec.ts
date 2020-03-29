import { HttpService, HttpModule } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import AuthTokenException from '../../../../domain/authentication/expectations/AuthTokenException/AuthToken.exception';

describe('Service: AuthService', () => {
    // given
    const token = '9876887867867678768678678';
    let decodeToken;
    let http: HttpService;

    beforeEach(async () => {
        decodeToken = jest.spyOn(JwtService.prototype, 'decode');

        const moduleRef = await Test.createTestingModule({
            imports: [HttpModule],
            controllers: [],
            providers: [],
        }).compile();
    
        http = moduleRef.get<HttpService>(HttpService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('authenticateByToken', () => {
        // given
        const tenantId = '88676578756456456';

        it('should throw AuthenticationException if the authentication fails', async () => {
            // given
            const authService: AuthService = new AuthService(http);
            // when
            try {
                await authService.authenticateByToken(tenantId, token);
            }
            catch (err) {
                // then
                expect(err.message).toEqual(`Authentication failed for tenant: ${tenantId}`);
            }
        });
    });

    describe('getContentFromAuthToken', () => {
        it('should decode the token and return the claim(s)', () => {
            // given
            const tokenContent = {
                tenantUuid: '455768577564645645'
            };
            decodeToken.mockReturnValue(tokenContent);
            const authService: AuthService = new AuthService(http);
            // when
            const result = authService.getContentFromAuthToken(token);
            // then
            expect(result).toEqual(tokenContent);
        });

        it('should throw AuthTokenException if the token does not include the tenantUuid', () => {
            // given
            const tokenContent = {};
            decodeToken.mockReturnValue(tokenContent);
            const authService: AuthService = new AuthService(http);
            // when
            // then
            expect(() => authService.getContentFromAuthToken(token)).toThrow(AuthTokenException);
        });
    });
});
