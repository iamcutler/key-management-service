import KeyManagementRepositoryAWSImpl from './KeyManagementRepositoryAWSImpl';
import CustomerKeyNotFoundException from '../exceptions/CustomerKeyNotFound/CustomerKeyNotFound.exception';

const createAlias = jest.fn();
const createKey = jest.fn();
const describeKey = jest.fn();

jest.mock('aws-sdk', () => ({
    KMS: jest.fn(() => ({
        createAlias,
        createKey,
        describeKey
    }))
}));

describe('KeyManagementRepositoryAWSImpl', () => {
    // given
    const customerId = '567567756756645456456';

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createKeyAlias', () => {
        it('should call the AWS SDK to KMS with the expected payload', async () => {
            // given
            const keyId: string = '65775675685746456';
            createAlias.mockImplementation(() => ({
                promise() {
                    return Promise.resolve({});
                }
            }));
            const keyManagement: KeyManagementRepositoryAWSImpl = new KeyManagementRepositoryAWSImpl(customerId);
            // when
            await keyManagement.createKeyAlias(keyId);
            // then
            expect(createAlias).toHaveBeenCalledWith({
                AliasName: keyManagement.getKeyAlias(),
                TargetKeyId: keyId
            });
        });
    });

    describe('getKeyAlias', () => {
        it('should return the current key and schema', () => {
            // given
            const keyManagement: KeyManagementRepositoryAWSImpl = new KeyManagementRepositoryAWSImpl(customerId);
            // when
            const result = keyManagement.getKeyAlias();
            // then
            expect(result).toEqual(`alias/${customerId}`);
        });
    });

    describe('createCustomerKey', () => {
        // given
        const keyId = '567756867645645';

        it('should call KMS with the expected payload', async () => {
            // given
            createKey.mockImplementation(() => ({
                promise() {
                    return Promise.resolve({ KeyMetadata: { KeyId: keyId } });
                }
            }));
            const keyManagement: KeyManagementRepositoryAWSImpl = new KeyManagementRepositoryAWSImpl(customerId);
            // when
            await keyManagement.createCustomerKey();
            // then
            expect(createKey).toHaveBeenCalledWith({
                Origin: 'AWS_KMS'
            });
        });

        it('should return the key if present', async () => {
            // given
            createKey.mockImplementation(() => ({
                promise() {
                    return Promise.resolve({ KeyMetadata: { KeyId: keyId } });
                }
            }));
            const keyManagement = new KeyManagementRepositoryAWSImpl(customerId);
            // when
            const result = await keyManagement.createCustomerKey();
            // then
            expect(result).toEqual({ keyId });
        });

        it('should throw CustomerKeyNotFoundException if the key is not found', async () => {
            // given
            createKey.mockImplementation(() => ({
                promise() {
                    return Promise.resolve(null);
                }
            }));
            const keyManagement = new KeyManagementRepositoryAWSImpl(customerId);
            // when
            try {
                await keyManagement.createCustomerKey();
            }
            catch (err) {
                // then
                expect(err).toBeInstanceOf(CustomerKeyNotFoundException);
            }
        });
    });

    describe('findExistingCustomerKey', () => {
        // given
        const keyId: string = '77566788657456456';

        it('should call KMS with the current key alias', async () => {
            // given
            describeKey.mockImplementation(() => ({
                promise() {
                    return Promise.resolve({ KeyMetadata: { KeyId: keyId } });
                }
            }));
            const keyManagement: KeyManagementRepositoryAWSImpl = new KeyManagementRepositoryAWSImpl(customerId);
            // when
            await keyManagement.findExistingCustomerKey();
            // then
            expect(describeKey).toHaveBeenCalledWith({
                KeyId: keyManagement.getKeyAlias()
            });
        });

        it('should return the key if present', async () => {
            // given
            describeKey.mockImplementation(() => ({
                promise() {
                    return Promise.resolve({ KeyMetadata: { KeyId: keyId } });
                }
            }));
            const keyManagement = new KeyManagementRepositoryAWSImpl(customerId);
            // when
            const result = await keyManagement.findExistingCustomerKey();
            // then
            expect(result).toEqual({ keyId });
        });

        it('should throw CustomerKeyNotFoundException if the key is not found', async () => {
            // given
            describeKey.mockImplementation(() => ({
                promise() {
                    return Promise.resolve(null);
                }
            }));
            const keyManagement = new KeyManagementRepositoryAWSImpl(customerId);
            // when
            try {
                await keyManagement.findExistingCustomerKey();
            }
            catch (err) {
                // then
                expect(err).toBeInstanceOf(CustomerKeyNotFoundException);
            }
        });
    });
});
