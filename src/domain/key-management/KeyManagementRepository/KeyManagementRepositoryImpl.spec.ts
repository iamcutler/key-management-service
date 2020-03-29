import KeyManagementRepositoryImpl from './KeyManagementRepositoryImpl';
import KeyManagementRepositoryAWSImpl from './KeyManagementRepositoryAWSImpl';
import { KeyManagementProvider } from '../KeyManagementProvider';

jest.mock('./KeyManagementRepositoryAWSImpl');

describe('KeyManagementRepositoryImpl', () => {
    // given
    const tenantId = '567567756756645456456';

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Provider: AWS', () => {
        // given
        const provider = KeyManagementProvider.AWS;
        const keyManagementImpl: KeyManagementRepositoryImpl = new KeyManagementRepositoryImpl(tenantId, provider);

        it('should init the AWS/KMS implementation', () => {
            // given
            // when
            // then
            expect(KeyManagementRepositoryAWSImpl).toHaveBeenCalledWith(tenantId);
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

        describe('createDataKey', () => {
            it('should call key store implementation method', () => {
                // given
                const keyId = '75654676587865767855687';
                // when
                keyManagementImpl.createDataKey(keyId);
                // then
                expect(KeyManagementRepositoryAWSImpl.prototype.createDataKey).toHaveBeenCalledWith(keyId);
            });
        });

        describe('decryptDataKey', () => {
            it('should call key store implementation method', () => {
                // given
                const keyId: string = '75654676587865767855687';
                const encryptedDataKey: string = "56756757676756756756";
                // when
                keyManagementImpl.decryptDataKey(keyId, encryptedDataKey);
                // then
                expect(KeyManagementRepositoryAWSImpl.prototype.decryptDataKey).toHaveBeenCalledWith(keyId, encryptedDataKey);
            });
        });
    });
});
