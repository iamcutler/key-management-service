import { Logger } from '@nestjs/common';
import KeyManagementProviderException from './KeyManagementProvider.exception';
import { KeyManagementProviderExceptionFilter } from './KeyManagementProvider.filter';
import mock from '../../../../../test/mock';

const { hostContext } = mock();

describe('Exception Filter: KeyManagementProviderException', () => {
    let filter: KeyManagementProviderExceptionFilter;

    beforeEach(() => {
        filter = new KeyManagementProviderExceptionFilter();

        jest.spyOn(Logger, 'error').mockImplementation(() => Logger.error);
    });

    it('should catch a KeyManagementProviderException and return the expected response', () => {
        // given
        const exception: KeyManagementProviderException = new KeyManagementProviderException('Provider not found');
        // when
        filter.catch(exception, hostContext);
        // then
        expect(hostContext.switchToHttp().getResponse().jsonResponse).toHaveBeenCalledWith(
            null, [exception.message], false, exception.getStatus()
        );
    });
});
