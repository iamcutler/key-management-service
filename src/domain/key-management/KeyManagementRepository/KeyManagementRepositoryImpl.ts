import {KMS} from 'aws-sdk';
import KeyManagementRepository from './KeyManagementRepository';
import CustomerKey from '../../models/key-management/CustomerKey';
import KeyManagementRepositoryAWSImpl from './KeyManagementRepositoryAWSImpl';
import { KeyManagementProvider } from '../KeyManagementProvider';
import KeyManagementProviderException from '../exceptions/KeyManagementProvider/KeyManagementProvider.exception';

export default class KeyManagementRepositoryImpl implements KeyManagementRepository {
    customerId: string;
    keyStore: any;

    /**
     * @constructor
     * @param customerId
     * @param keyStore
     */
    constructor(customerId: string, keyStore: KeyManagementProvider) {
        this.customerId = customerId;

        // AWS Key Management Service
        if (keyStore === KeyManagementProvider.KMS) {
            this.keyStore = new KeyManagementRepositoryAWSImpl(customerId);
        }
        else {
            throw new KeyManagementProviderException(`No cloud provider was present for customer: ${this.customerId}`);
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
