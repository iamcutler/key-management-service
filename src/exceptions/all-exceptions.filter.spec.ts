import { Logger } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { INTERNAL_SERVER_ERROR } from 'http-status';
import mock from '../../test/mock';

const { hostContext } = mock();

describe('Exception Filter: AllExceptionsFilter', () => {
    let filter: AllExceptionsFilter;

    beforeEach(() => {
        filter = new AllExceptionsFilter();

        jest.spyOn(Logger, 'error').mockImplementation(() => Logger.error);
    });

    it('should catch a CustomerKeyNotFoundException and return the correct response', () => {
        // given
        const exception: Error = new Error('Customer key not found');
        // when
        filter.catch(exception, hostContext);
        // then
        expect(hostContext.switchToHttp().getResponse().jsonResponse).toHaveBeenCalledWith(
            null, ['Internal Server Error'], false, INTERNAL_SERVER_ERROR
        );
    });

    it('should log the exception with the expected signature', () => {
        // given
        const exception: Error = new Error('Customer key not found');
        // when
        filter.catch(exception, hostContext);
        // then
        expect(Logger.error).toHaveBeenCalledWith({
            message: 'Internal Server Error',
            timestamp: expect.any(String),
            exception,
        });
    });
});
