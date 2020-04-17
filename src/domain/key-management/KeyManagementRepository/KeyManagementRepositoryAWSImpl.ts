import { KMS, STS } from 'aws-sdk';
import KeyManagementRepository from './KeyManagementRepository';
import CustomerKey from '../../models/key-management/CustomerKey';
import CustomerKeyNotFoundException from '../exceptions/CustomerKeyNotFound/CustomerKeyNotFound.exception';
import { GetCallerIdentityResponse } from 'aws-sdk/clients/sts';
import DataKey from '../../models/key-management/DataKey';
import { GenerateDataKeyResponse } from 'aws-sdk/clients/kms';
import { ConfigService } from '@nestjs/config';

export default class KeyManagementRepositoryAWSImpl implements KeyManagementRepository {
    tenantId: string;
    keyStore: KMS;

    /**
     * @constructor
     */
    constructor(
        private readonly configService: ConfigService,
        tenantId: string
    ) {
        this.tenantId = tenantId;
        this.keyStore = new KMS({
            region: this.configService.get<string>('AWS_REGION'),
            // use access keys if present
            ...(
                this.configService.get<string>('AWS_ACCESS_KEY_ID') && this.configService.get<string>('AWS_SECRET_ACCESS_KEY') ? {
                    accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
                    secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY')
                } : {}
            )
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
     * Generate an AWS data key from the CMK
     *
     * @param keyAlias
     */
    async createDataKey(keyAlias: string): Promise<DataKey> {
        const dataKey: GenerateDataKeyResponse = await this.keyStore.generateDataKey({
            KeyId: `alias/${keyAlias}`,
            KeySpec: 'AES_256'
        }).promise();

        return {
            keyId: dataKey.KeyId,
            plainText: dataKey.Plaintext.toString('base64'),
            cipherText: dataKey.CiphertextBlob.toString('base64')
        };
    }

    /**
     * Decrypt a data key
     *
     * @param keyAlias
     * @param encryptedDataKey
     */
    async decryptDataKey(keyAlias: string, encryptedDataKey: string): Promise<DataKey> {
        const dataKey: GenerateDataKeyResponse = await this.keyStore.decrypt({
            KeyId: `alias/${keyAlias}`,
            CiphertextBlob: Buffer.from(encryptedDataKey, 'base64')
        }).promise();

        return {
            keyId: dataKey.KeyId,
            plainText: dataKey.Plaintext.toString('base64')
        };
    };

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
                    }
                ]
            }),
            PolicyName: 'default'
        };

        return await this.keyStore.putKeyPolicy(params).promise();
    }

    /**
     * Get the current user account id
     * @private
     */
    private async getUserIdentity(): Promise<GetCallerIdentityResponse> {
        const sts: STS = new STS({
            // use access keys if present
            ...(
                this.configService.get<string>('AWS_ACCESS_KEY_ID') && this.configService.get<string>('AWS_SECRET_ACCESS_KEY') ? {
                    accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
                    secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY')
                } : {}
            )
        });

        return await sts.getCallerIdentity().promise();
    }
}
