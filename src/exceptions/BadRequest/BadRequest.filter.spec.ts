import { Logger, BadRequestException } from '@nestjs/common';
import BadRequestExceptionFilter from './BadRequest.filter';
import { BAD_REQUEST } from 'http-status';
import mock from '../../../test/mock';

const { hostContext } = mock();

describe('Exception Filter: BadRequestExceptionFilter', () => {
    let filter: BadRequestExceptionFilter;

    beforeEach(() => {
        filter = new BadRequestExceptionFilter();

        jest.spyOn(Logger, 'error').mockImplementation(() => Logger.error);
    });

    it('should catch a BadRequestException and return the correct response', () => {
        // given
        const exception: BadRequestException = new BadRequestException('Something went wrong');
        // when
        filter.catch(exception, hostContext);
        // then
        expect(hostContext.switchToHttp().getResponse().jsonResponse).toHaveBeenCalledWith(
            null, exception['response']['message'], false, BAD_REQUEST
        );
    });

    it('should log the exception with the expected signature', () => {
        // given
        const exception: BadRequestException = new BadRequestException('Something went wrong');
        // when
        filter.catch(exception, hostContext);
        // then
        expect(Logger.error).toHaveBeenCalledWith(exception);
    });
});
