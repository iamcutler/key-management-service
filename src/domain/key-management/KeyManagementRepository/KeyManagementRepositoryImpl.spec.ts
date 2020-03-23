import KeyManagementRepositoryImpl from './KeyManagementRepositoryImpl';
import KeyManagementRepositoryAWSImpl from './KeyManagementRepositoryAWSImpl';
import KeyManagementProviderException from '../exceptions/KeyManagementProvider/KeyManagementProvider.exception';
import { KeyManagementProvider } from '../KeyManagementProvider';

jest.mock('./KeyManagementRepositoryAWSImpl');

describe('KeyManagementRepositoryImpl', () => {
    // given
    const customerId = '567567756756645456456';

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Provider: KMS', () => {
        // given
        const provider = KeyManagementProvider.KMS;
        const keyManagementImpl: KeyManagementRepositoryImpl = new KeyManagementRepositoryImpl(customerId, provider);

        it('should init the AWS/KMS implementation', () => {
            // given
            // when
            // then
            expect(KeyManagementRepositoryAWSImpl).toHaveBeenCalledWith(customerId);
        });

        describe('createKeyAlias', () => {
            it('should call key store implementation method', () => {
                // given
                const keyId: string = '75676578756676575';
                // when
                keyManagementImpl.createKeyAlias(keyId);
                // then
                expect(KeyManagementRepositoryAWSImpl.prototype.createKeyAlias).toHaveBeenCalledWith(keyId);
            });
        });

        describe('createCustomerKey', () => {
            it('should call key store implementation method', () => {
                // given
                // when
                keyManagementImpl.createCustomerKey();
                // then
                expect(KeyManagementRepositoryAWSImpl.prototype.createCustomerKey).toHaveBeenCalledWith();
            });
        });

        describe('findExistingCustomerKey', () => {
            it('should call key store implementation method', () => {
                // given
                // when
                keyManagementImpl.findExistingCustomerKey();
                // then
                expect(KeyManagementRepositoryAWSImpl.prototype.findExistingCustomerKey).toHaveBeenCalledWith();
            });
        });

        describe('getKeyAlias', () => {
            it('should call key store implementation method', () => {
                // given
                // when
                keyManagementImpl.getKeyAlias();
                // then
                expect(KeyManagementRepositoryAWSImpl.prototype.getKeyAlias).toHaveBeenCalledWith();
            });
        });
    });
});
