import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import KeyManagementRepositoryAWSImpl from './KeyManagementRepositoryAWSImpl';
import CustomerKeyNotFoundException from '../exceptions/CustomerKeyNotFound/CustomerKeyNotFound.exception';

const createAlias = jest.fn();
const createKey = jest.fn();
const describeKey = jest.fn();
const putKeyPolicy = jest.fn().mockImplementation(() => ({
    promise: jest.fn()
}));
const generateDataKey = jest.fn().mockImplementation(() => ({
    promise: jest.fn()
}));
const decrypt = jest.fn().mockImplementation(() => ({
    promise: jest.fn()
}));
const getCallerIdentity = jest.fn().mockImplementation(() => ({
    promise() {
        return Promise.resolve({});
    }
}));

jest.mock('aws-sdk', () => ({
    KMS: jest.fn(() => ({
        createAlias,
        createKey,
        describeKey,
        decrypt,
        generateDataKey,
        putKeyPolicy,
    })),
    STS: jest.fn(() => ({
        getCallerIdentity,
    }))
}));

describe('KeyManagementRepositoryAWSImpl', () => {
    // given
    const tenantId = '567567756756645456456';
    const configService: ConfigService = new ConfigService();

    beforeEach(async (): Promise<void> => {
        await Test.createTestingModule({
            controllers: [],
            providers: [],
            imports: [
                ConfigModule.forRoot()
            ]
          }).compile();
    });
    
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
            const keyManagement: KeyManagementRepositoryAWSImpl = new KeyManagementRepositoryAWSImpl(configService, tenantId);
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
            const keyManagement: KeyManagementRepositoryAWSImpl = new KeyManagementRepositoryAWSImpl(configService, tenantId);
            // when
            const result = keyManagement.getKeyAlias();
            // then
            expect(result).toEqual(`alias/${tenantId}`);
        });
    });

    describe('createCustomerKey', () => {
        // given
        const keyId = '567756867645645';

        it('should call KMS to create the key with the expected payload', async () => {
            // given
            createKey.mockImplementation(() => ({
                promise() {
                    return Promise.resolve({ KeyMetadata: { KeyId: keyId } });
                }
            }));
            const keyManagement: KeyManagementRepositoryAWSImpl = new KeyManagementRepositoryAWSImpl(configService, tenantId);
            // when
            await keyManagement.createCustomerKey();
            // then
            expect(createKey).toHaveBeenCalledWith({
                Origin: 'AWS_KMS',
                Tags: [{
                    TagKey: 'tenantId',
                    TagValue: tenantId,
                }],
            });
        });

        it('should return the key if present', async () => {
            // given
            createKey.mockImplementation(() => ({
                promise() {
                    return Promise.resolve({ KeyMetadata: { KeyId: keyId } });
                }
            }));
            const keyManagement = new KeyManagementRepositoryAWSImpl(configService, tenantId);
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
            const keyManagement = new KeyManagementRepositoryAWSImpl(configService, tenantId);
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
            const keyManagement: KeyManagementRepositoryAWSImpl = new KeyManagementRepositoryAWSImpl(configService, tenantId);
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
            const keyManagement = new KeyManagementRepositoryAWSImpl(configService, tenantId);
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
            const keyManagement = new KeyManagementRepositoryAWSImpl(configService, tenantId);
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

    describe('setKeyPolicy', () => {
        beforeEach(() => {
            putKeyPolicy.mockImplementation(() => ({
                promise() {
                    return Promise.resolve(null);
                }
            }));
        });

        it('should update the key policy for a targeted CMK', async () => {
            // given
            const keyId: string = '65775675685746456';
            const accountId: string = '45456756456';
            const keyManagement: KeyManagementRepositoryAWSImpl = new KeyManagementRepositoryAWSImpl(configService, tenantId);
            // when
            await keyManagement.setKeyPolicy(keyId, accountId, tenantId);
            // then
            expect(putKeyPolicy).toHaveBeenCalledWith({
                KeyId: keyId,
                Policy: JSON.stringify({
                    "Version": "2012-10-17",
                    "Id": `key-policy-${tenantId}`,
                    "Statement": [
                        {
                            "Sid": "Enable IAM User Permissions",
                            "Effect": "Allow",
                            "Principal": {
                                "AWS": `arn:aws:iam::${accountId}:root`
                            },
                            "Action": "kms:*",
                            "Resource": "*"
                        }
                    ]
                }),
                PolicyName: 'default'
            });
        });
    });

    describe('createDataKey', () => {
        beforeEach(() => {
            generateDataKey.mockImplementation(() => ({
                promise() {
                    return Promise.resolve({
                        KeyId: '75467865764345345',
                        Plaintext: Buffer.from('plaintext'),
                        CiphertextBlob: Buffer.from('ciphertext')
                    });
                }
            }));
        });

        it('should call KMS to generate a data key from the CMK', async () => {
            // given
            const keyAlias: string = '65775675685746456';
            const keyManagement: KeyManagementRepositoryAWSImpl = new KeyManagementRepositoryAWSImpl(configService, tenantId);
            // when
            await keyManagement.createDataKey(keyAlias);
            // then
            expect(generateDataKey).toHaveBeenCalledWith({
                KeyId: `alias/${keyAlias}`,
                KeySpec: 'AES_256'
            });
        });
    });

    describe('decryptDataKey', () => {
        // given
        const keyAlias: string = '76657868756786875678';
        const encryptedDataKey: string = "5676857867576465465653";

        beforeEach(() => {
            decrypt.mockImplementation(() => ({
                promise() {
                    return Promise.resolve({
                        KeyId: '75467865764345345',
                        Plaintext: Buffer.from('plaintext'),
                    });
                }
            }));
        });

        it('should call KMS to decrypt an encrypted data key', async () => {
            // given
            const keyManagement: KeyManagementRepositoryAWSImpl = new KeyManagementRepositoryAWSImpl(configService, tenantId);
            // when
            await keyManagement.decryptDataKey(keyAlias, encryptedDataKey);
            // then
            expect(decrypt).toHaveBeenCalledWith({
                KeyId: `alias/${keyAlias}`,
                CiphertextBlob: Buffer.from(encryptedDataKey, 'base64')
            });
        });
    });
});
