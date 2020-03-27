import { KMS, STS } from 'aws-sdk';
import KeyManagementRepository from './KeyManagementRepository';
import CustomerKey from '../../models/key-management/CustomerKey';
import CustomerKeyNotFoundException from '../exceptions/CustomerKeyNotFound/CustomerKeyNotFound.exception';
import { GetCallerIdentityResponse } from 'aws-sdk/clients/sts';

export default class KeyManagementRepositoryAWSImpl implements KeyManagementRepository {
    tenantId: string;
    keyStore: KMS;

    /**
     * @constructor
     */
    constructor(tenantId: string) {
        this.tenantId = tenantId;
        this.keyStore = new KMS({
            region: 'us-east-2',
            accessKeyId: '',
            secretAccessKey: ''
        });
    }

    /**
     * Create a customer master key alias from a CMK
     *
     * @param keyId
     */
    async createKeyAlias(keyId: string) : Promise<void> {
        // create the alias from the CMK key
        await this.keyStore.createAlias({
            AliasName: this.getKeyAlias(),
            TargetKeyId: keyId
        }).promise();
    }

    /**
     * Create a Customer Master Key (CMK)
     */
    async createCustomerKey() : Promise<CustomerKey> {
        // get the user/role account id
        const user = await this.getUserIdentity();
        const accountId = user.Account;

        // call AWS KMS to create the key
        const key = await this.keyStore.createKey({
            Origin: 'AWS_KMS',
            Tags: [{
                TagKey: 'tenantId',
                TagValue: this.tenantId
            }]
        }).promise();

        if (key && key.KeyMetadata)  {
            const keyId = key.KeyMetadata.KeyId;

            // generate the key policy for the new key
            await this.setKeyPolicy(keyId, accountId, this.tenantId);

            return {
                keyId,
            };
        }

        throw new CustomerKeyNotFoundException(`Creating customer key failed for customer: ${this.tenantId}`);
    }

    /**
     * Find an existing customer master key
     */
    async findExistingCustomerKey() : Promise<CustomerKey> {
        const key = await this.keyStore.describeKey({
            KeyId: this.getKeyAlias()
        }).promise();

        if (key && key.KeyMetadata)  {
            return {
                keyId: key.KeyMetadata.KeyId
            };
        }

        throw new CustomerKeyNotFoundException(`Finding customer key failed for customer: ${this.tenantId}`);
    }

    /**
     * Get the key alias
     * @description The KMS alias must start with alias/
     */
    getKeyAlias() : string {
        return `alias/${this.tenantId}`;
    }

    /**
     * Get the current user account id
     */
    private async getUserIdentity(): Promise<GetCallerIdentityResponse> {
        const sts: STS = new STS({
            accessKeyId: '',
            secretAccessKey: ''
        });

        return await sts.getCallerIdentity().promise();
    }

    /**
     * Get the associated key policy
     * @description this policy is used to restrict the access of the key to the entended principal(s)
     *
     * @param keyId
     * @param accountId 
     * @param tenantId 
     */
    async setKeyPolicy(keyId: string, accountId: string, tenantId: string) {
        const params = {
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
                            "StringNotEquals": {
                                "ec2:ResourceTag/tenantId": `${tenantId}`
                            }
                        }
                    }
                ]
            }),
            PolicyName: 'default'
        };

        return await this.keyStore.putKeyPolicy(params).promise();
    }
}
