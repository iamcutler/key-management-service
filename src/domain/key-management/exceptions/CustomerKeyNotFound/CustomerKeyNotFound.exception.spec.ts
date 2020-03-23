import { NOT_FOUND } from 'http-status';
import CustomerKeyNotFoundException from './CustomerKeyNotFound.exception';

describe('Exception: CustomerKeyNotFoundException', () => {
    it('should have return the expected http status code', () => {
        // given
        const message: string = 'Something went wrong';
        // when
        const result: CustomerKeyNotFoundException = new CustomerKeyNotFoundException(message);
        // then
        expect(result.getStatus()).toEqual(NOT_FOUND);
    });
});
