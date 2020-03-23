import KeyManagementRepositoryImpl from './KeyManagementRepositoryImpl';
import KeyManagementRepositoryAWSImpl from './KeyManagementRepositoryAWSImpl';
import KeyManagementProviderException from '../exceptions/KeyManagementProvider/KeyManagementProvider.exception';
import { KeyManagementProvider } from '../KeyManagementProvider';

jest.mock('./KeyManagementRepositoryAWSImpl');

describe.skip('KeyManagementRepositoryImpl', () => {
    // given
    const customerId = '567567756756645456456';

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Provider: KMS', () => {
        // given
        const provider = KeyManagementProvider.KMS;

        beforeEach(() => {
            jest.spyOn(KeyManagementRepositoryAWSImpl, 'getKeyAlias');
        });

        it('should init the AWS/KMS implementation', () => {
            // given
            // when
            new KeyManagementRepositoryImpl(customerId, provider);
            // then
            expect(KeyManagementRepositoryAWSImpl).toHaveBeenCalledWith(customerId);
        });

        describe('createKeyAlias', () => {
            it('should call key store implementation method', () => {
                // given
                const keyManagementRepo = new KeyManagementRepositoryImpl(customerId, provider);
                // when
                keyManagementRepo.getKeyAlias();
                // then
                expect(KeyManagementRepositoryAWSImpl.getKeyAlias).toHaveBeenCalled();
            });
        });
    });
});
