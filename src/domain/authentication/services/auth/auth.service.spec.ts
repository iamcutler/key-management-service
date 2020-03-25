import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import AuthTokenException from '../../../../domain/authentication/expectations/AuthTokenException/AuthToken.exception';

describe('Service: AuthService', () => {
    // given
    const token = '9876887867867678768678678';
    let decodeToken;

    beforeEach(async () => {
        decodeToken = jest.spyOn(JwtService.prototype, 'decode');
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('getContentFromAuthToken', () => {
        it('should decode the token and return the claim(s)', () => {
            // given
            const tokenContent = {
                tenantUuid: '455768577564645645'
            };
            decodeToken.mockReturnValue(tokenContent);
            const authService: AuthService = new AuthService();
            // when
            const result = authService.getContentFromAuthToken(token);
            // then
            expect(result).toEqual(tokenContent);
        });

        it('should throw AuthTokenException if the token does not include the tenantUuid', () => {
            // given
            const tokenContent = {};
            decodeToken.mockReturnValue(tokenContent);
            const authService: AuthService = new AuthService();
            // when
            // then
            expect(() => authService.getContentFromAuthToken(token)).toThrow(AuthTokenException);
        });
    });
});
