import { UNAUTHORIZED } from 'http-status';
import AuthenticationException from './Authentication.exception';

describe('Exception: AuthenticationException', () => {
    it('should have return the expected http status code', () => {
        // given
        const message: string = 'Something went wrong';
        // when
        const result: AuthenticationException = new AuthenticationException(message);
        // then
        expect(result.getStatus()).toEqual(UNAUTHORIZED);
    });
});
