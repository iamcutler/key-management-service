import {KMS} from 'aws-sdk';
import KeyManagementRepository from './KeyManagementRepository';
import CustomerKey from '../models/key-management/CustomerKey';
import CustomerKeyNotFound from '../../exceptions/CustomerKeyNotFound';

export default class KeyManagementAWSImpl implements KeyManagementRepository {
    keyStore: KMS;

    /**
     * @constructor
     */
    constructor() {
        this.keyStore = new KMS({
            region: 'us-east-2',
            accessKeyId: '',
            secretAccessKey: ''
        });
    }

    /**
     * Create a customer master key alias from a CMK
     */
    async createKeyAlias(customerId: string, keyId: string) : Promise<void> {
        // create the alias from the CMK key
        await this.keyStore.createAlias({
            AliasName: `alias/${customerId}`,
            TargetKeyId: keyId
        }).promise();
    }

    /**
     * Create a Customer Master Key (CMK)
     */
    async createCustomerKey(customerId: string) : Promise<CustomerKey> {
        // call AWS KMS to create the key
        const key = await this.keyStore.createKey({
            Origin: 'AWS_KMS'
        }).promise();

        if (key && key.KeyMetadata)  {
            return {
                keyId: key.KeyMetadata.KeyId
            };
        }

        throw new CustomerKeyNotFound(`Creating customer key failed for customer: ${customerId}`);
    }

    /**
     * Find an existing customer master key
     *
     * @param customerId
     */
    async findExistingCustomerKey(customerId: string) : Promise<CustomerKey> {
        const key = await this.keyStore.describeKey({
            KeyId: `alias/${customerId}`
        }).promise();

        if (key && key.KeyMetadata)  {
            return {
                keyId: key.KeyMetadata.KeyId
            };
        }

        throw new CustomerKeyNotFound(`Finding customer key failed for customer: ${customerId}`);
    }
}
