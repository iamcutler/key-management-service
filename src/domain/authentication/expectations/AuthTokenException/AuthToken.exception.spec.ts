import { BAD_REQUEST } from 'http-status';
import AuthTokenException from './AuthToken.exception';

describe('Exception: AuthTokenException', () => {
    it('should have return the expected http status code', () => {
        // given
        const message: string = 'Something went wrong';
        // when
        const result: AuthTokenException = new AuthTokenException(message);
        // then
        expect(result.getStatus()).toEqual(BAD_REQUEST);
    });
});
