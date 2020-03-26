import { Logger } from '@nestjs/common';
import AuthenticationException from './Authentication.exception';
import { AuthenticationExceptionFilter } from './Authentication.exception.filter';
import mock from '../../../../../test/mock';

const { hostContext } = mock();

describe('Exception Filter: AuthenticationExceptionFilter', () => {
    let filter: AuthenticationExceptionFilter;

    beforeEach(() => {
        filter = new AuthenticationExceptionFilter();

        jest.spyOn(Logger, 'error').mockImplementation(() => Logger.error);
    });

    it('should catch a AuthenticationException and return the expected response', () => {
        // given
        const exception: AuthenticationException = new AuthenticationException('Authentication failed');
        // when
        filter.catch(exception, hostContext);
        // then
        expect(hostContext.switchToHttp().getResponse().jsonResponse).toHaveBeenCalledWith(
            null, [exception.message], false, exception.getStatus()
        );
    });
});
