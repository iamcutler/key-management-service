import {KMS} from 'aws-sdk';
import KeyManagementRepository from './KeyManagementRepository';
import CustomerKey from '../models/key-management/CustomerKey';
import KeyManagementRepositoryAWSImpl from './KeyManagementRepositoryAWSImpl';

export default class KeyManagementRepositoryImpl implements KeyManagementRepository {
    customerId: string;
    keyStore: any;

    /**
     * @constructor
     */
    constructor(customerId: string, keyStore = 'AWS') {
        this.customerId = customerId;

        switch(keyStore) {
            default:
                this.keyStore = new KeyManagementRepositoryAWSImpl(customerId);
        }
    }

    /**
     * Create a customer master key alias from a CMK
     *
     * @param keyId
     */
    async createKeyAlias(keyId: string) : Promise<void> {
        this.keyStore.createKeyAlias(keyId);
    }

    /**
     * Create a Customer Master Key (CMK)
     */
    async createCustomerKey() : Promise<CustomerKey> {
        return this.keyStore.createCustomerKey();
    }

    /**
     * Find an existing customer master key
     */
    async findExistingCustomerKey() : Promise<CustomerKey> {
        return this.keyStore.findExistingCustomerKey();
    }

    /**
     * Get the key alias
     * @description The KMS alias must start with alias/
     */
    getKeyAlias() : string {
        return this.keyStore.getKeyAlias();
    }
}
