import {KMS} from 'aws-sdk';
import KeyManagementRepository from './KeyManagementRepository';
import CustomerKey from '../models/key-management/CustomerKey';
import CustomerKeyNotFound from '../../exceptions/CustomerKeyNotFound';

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
            accessKeyId: 'AKIAICXPBE3QFSJ7DP2Q',
            secretAccessKey: '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'
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
        // call AWS KMS to create the key
        const key = await this.keyStore.createKey({
            Origin: 'AWS_KMS'
        }).promise();

        if (key && key.KeyMetadata)  {
            return {
                keyId: key.KeyMetadata.KeyId
            };
        }

        throw new CustomerKeyNotFound(`Creating customer key failed for customer: ${this.customerId}`);
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

        throw new CustomerKeyNotFound(`Finding customer key failed for customer: ${this.customerId}`);
    }

    /**
     * Get the key alias
     * @description The KMS alias must start with alias/
     *
     * @param customerId
     */
    getKeyAlias() : string {
        return `alias/${this.customerId}`;
    }
}
