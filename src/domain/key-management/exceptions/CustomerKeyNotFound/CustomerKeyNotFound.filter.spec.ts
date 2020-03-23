import { Logger } from '@nestjs/common';
import CustomerKeyNotFoundException from './CustomerKeyNotFound.exception';
import { CustomerKeyNotFoundExceptionFilter } from './CustomerKeyNotFound.filter';
import mock from '../../../../../test/mock';

const { hostContext } = mock();

describe('Exception Filter: CustomerKeyNotFoundException', () => {
    let filter: CustomerKeyNotFoundExceptionFilter;

    beforeEach(() => {
        filter = new CustomerKeyNotFoundExceptionFilter();

        jest.spyOn(Logger, 'error').mockImplementation(() => Logger.error);
    });

    it('should catch a CustomerKeyNotFoundException and return the expected response', () => {
        // given
        const exception: CustomerKeyNotFoundException = new CustomerKeyNotFoundException('Customer key not found');
        // when
        filter.catch(exception, hostContext);
        // then
        expect(hostContext.switchToHttp().getResponse().jsonResponse).toHaveBeenCalledWith(
            null, [exception.message], false, exception.getStatus()
        );
    });
});
