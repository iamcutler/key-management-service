import { Logger, NotFoundException } from '@nestjs/common';
import NotFoundExceptionFilter from './NotFound.filter';
import { NOT_FOUND } from 'http-status';
import mock from '../../../test/mock';

const { hostContext } = mock();

describe('Exception Filter: NotFoundExceptionFilter', () => {
    let filter: NotFoundExceptionFilter;

    beforeEach(() => {
        filter = new NotFoundExceptionFilter();

        jest.spyOn(Logger, 'error').mockImplementation(() => Logger.error);
    });

    it('should catch a BadRequestException and return the correct response', () => {
        // given
        const exception: NotFoundException = new NotFoundException('Route not found');
        // when
        filter.catch(exception, hostContext);
        // then
        expect(hostContext.switchToHttp().getResponse().jsonResponse).toHaveBeenCalledWith(
            null, exception['response']['message'], false, NOT_FOUND
        );
    });

    it('should log the exception with the expected signature', () => {
        // given
        const exception: NotFoundException = new NotFoundException('Route not found');
        // when
        filter.catch(exception, hostContext);
        // then
        expect(Logger.error).toHaveBeenCalledWith(exception);
    });
});
