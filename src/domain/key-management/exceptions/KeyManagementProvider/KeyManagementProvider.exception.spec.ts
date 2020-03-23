import { BAD_REQUEST } from 'http-status';
import KeyManagementProviderException from './KeyManagementProvider.exception';

describe('Exception: KeyManagementProvider', () => {
    it('should have return the expected http status code', () => {
        // given
        const message: string = 'Something went wrong';
        // when
        const result: KeyManagementProviderException = new KeyManagementProviderException(message);
        // then
        expect(result.getStatus()).toEqual(BAD_REQUEST);
    });
});
