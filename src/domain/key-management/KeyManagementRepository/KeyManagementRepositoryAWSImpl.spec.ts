import KeyManagementRepositoryAWSImpl from './KeyManagementRepositoryAWSImpl';
import CustomerKeyNotFoundException from '../exceptions/CustomerKeyNotFound/CustomerKeyNotFound.exception';

const createAlias = jest.fn();
const createKey = jest.fn();
const describeKey = jest.fn();
const putKeyPolicy = jest.fn();
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
        putKeyPolicy,
    })),
    STS: jest.fn(() => ({
        getCallerIdentity,
    }))
}));

describe('KeyManagementRepositoryAWSImpl', () => {
    // given
    const tenantId = '567567756756645456456';

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
            const keyManagement: KeyManagementRepositoryAWSImpl = new KeyManagementRepositoryAWSImpl(tenantId);
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
            const keyManagement: KeyManagementRepositoryAWSImpl = new KeyManagementRepositoryAWSImpl(tenantId);
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
            const keyManagement: KeyManagementRepositoryAWSImpl = new KeyManagementRepositoryAWSImpl(tenantId);
            // when
            await keyManagement.createCustomerKey();
            // then
            expect(createKey).toHaveBeenCalledWith({
                Origin: 'AWS_KMS',
                Tags: [{
                    TagKey: 'tenantid',
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
            const keyManagement = new KeyManagementRepositoryAWSImpl(tenantId);
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
            const keyManagement = new KeyManagementRepositoryAWSImpl(tenantId);
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
            const keyManagement: KeyManagementRepositoryAWSImpl = new KeyManagementRepositoryAWSImpl(tenantId);
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
            const keyManagement = new KeyManagementRepositoryAWSImpl(tenantId);
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
            const keyManagement = new KeyManagementRepositoryAWSImpl(tenantId);
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
        it('should update the key policy for a targeted CMK', async () => {
            // given
            const keyId: string = '65775675685746456';
            const accountId: string = '45456756456';
            putKeyPolicy.mockImplementation((): void => null);
            const keyManagement: KeyManagementRepositoryAWSImpl = new KeyManagementRepositoryAWSImpl(tenantId);
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
                        },
                        {
                            "Sid": "Allow access for Key Administrators",
                            "Effect": "Allow",
                            "Principal": {
                                "AWS": `arn:aws:iam::${accountId}:role/iqbot-key-admin`
                            },
                            "Action": [
                                "kms:Describe*",
                                "kms:Put*",
                                "kms:Create*",
                                "kms:Update*",
                                "kms:Enable*",
                                "kms:Revoke*",
                                "kms:List*",
                                "kms:Disable*",
                                "kms:Get*",
                                "kms:Delete*",
                                "kms:ScheduleKeyDeletion",
                                "kms:CancelKeyDeletion"
                            ],
                            "Resource": "*"
                        },
                        {
                            "Sid": "Allow use of the key",
                            "Effect": "Allow",
                            "Principal": {
                                "AWS": `arn:aws:iam::${accountId}:role/iqbot-app`
                            },
                            "Action": [
                                "kms:Create*",
                                "kms:PutKeyPolicy",
                                "kms:DescribeKey",
                                "kms:GenerateDataKey*",
                                "kms:Encrypt",
                                "kms:ReEncrypt*",
                                "kms:Decrypt"
                            ],
                            "Resource": "*",
                            "Condition": {
                                "StringEquals": {
                                    "aws:PrincipalTag/tenantId": `${tenantId}`
                                }
                            }
                        }
                    ]
                }),
                PolicyName: 'default'
            });
        });
    });
});
