import {KMS} from 'aws-sdk';
import KeyManagementRepository from './KeyManagementRepository';
import CustomerKey from '../../models/key-management/CustomerKey';
import KeyManagementRepositoryAWSImpl from './KeyManagementRepositoryAWSImpl';
import { KeyManagementProvider } from '../KeyManagementProvider';
import KeyManagementProviderException from '../exceptions/KeyManagementProvider/KeyManagementProvider.exception';
import DataKey from '../../../domain/models/key-management/DataKey';

export default class KeyManagementRepositoryImpl implements KeyManagementRepository {
    tenantId: string;
    keyStore: any;

    /**
     * @constructor
     * @param tenantId
     * @param keyStore
     */
    constructor(tenantId: string, keyStore: KeyManagementProvider) {
        this.tenantId = tenantId;

        // AWS Key Management Service
        if (keyStore === KeyManagementProvider.AWS) {
            this.keyStore = new KeyManagementRepositoryAWSImpl(tenantId);
        }
        else {
            throw new KeyManagementProviderException(`No cloud provider was present for customer: ${this.tenantId}`);
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

    /**
     * Create a data key from a CMK
     *
     * @param keyId
     */
    async createDataKey(keyId: string): Promise<DataKey> {
        return this.keyStore.createDataKey(keyId);
    }

    /**
     * Decrypt a data key
     *
     * @param keyId 
     * @param encryptedDataKey 
     */
    async decryptDataKey(keyId: string, encryptedDataKey: string): Promise<DataKey> {
        return this.keyStore.decryptDataKey(keyId, encryptedDataKey);
    }
}
