import { Logger } from '@nestjs/common';
import AuthTokenException from './AuthToken.exception';
import { AuthTokenExceptionFilter } from './AuthToken.exception.filter';
import mock from '../../../../../test/mock';

const { hostContext } = mock();

describe('Exception Filter: AuthTokenExceptionFilter', () => {
    let filter: AuthTokenExceptionFilter;

    beforeEach(() => {
        filter = new AuthTokenExceptionFilter();

        jest.spyOn(Logger, 'error').mockImplementation(() => Logger.error);
    });

    it('should catch a AuthTokenException and return the expected response', () => {
        // given
        const exception: AuthTokenException = new AuthTokenException('Authorization Bearer token is not present');
        // when
        filter.catch(exception, hostContext);
        // then
        expect(hostContext.switchToHttp().getResponse().jsonResponse).toHaveBeenCalledWith(
            null, [exception.message], false, exception.getStatus()
        );
    });
});
