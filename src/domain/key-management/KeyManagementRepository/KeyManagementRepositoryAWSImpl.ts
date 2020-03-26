import { KMS, STS } from 'aws-sdk';
import KeyManagementRepository from './KeyManagementRepository';
import CustomerKey from '../../models/key-management/CustomerKey';
import CustomerKeyNotFoundException from '../exceptions/CustomerKeyNotFound/CustomerKeyNotFound.exception';
import { GetCallerIdentityResponse } from 'aws-sdk/clients/sts';

export default class KeyManagementRepositoryAWSImpl implements KeyManagementRepository {
    customerId: string;
    keyStore: KMS;

    /**
     * @constructor
     */
    constructor(customerId: string) {
        this.customerId = customerId;
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
                TagKey: 'tenantid',
                TagValue: this.customerId
            }]
        }).promise();

        if (key && key.KeyMetadata)  {
            const keyId = key.KeyMetadata.KeyId;

            // generate the key policy for the new key
            await this.setKeyPolicy(keyId, accountId, this.customerId);

            return {
                keyId,
            };
        }

        throw new CustomerKeyNotFoundException(`Creating customer key failed for customer: ${this.customerId}`);
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

        throw new CustomerKeyNotFoundException(`Finding customer key failed for customer: ${this.customerId}`);
    }

    /**
     * Get the key alias
     * @description The KMS alias must start with alias/
     */
    getKeyAlias() : string {
        return `alias/${this.customerId}`;
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
     * @param customerId 
     */
    async setKeyPolicy(keyId: string, accountId: string, customerId: string) {
        const params = {
            KeyId: keyId,
            Policy: JSON.stringify({
                "Version": "2012-10-17",
                "Id": `key-policy-${customerId}`,
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
                                "aws:PrincipalTag/tenantid": `${customerId}`
                            }
                        }
                    }
                ]
            }),
            PolicyName: 'default'
        };

        return await this.keyStore.putKeyPolicy(params);
    }
}
