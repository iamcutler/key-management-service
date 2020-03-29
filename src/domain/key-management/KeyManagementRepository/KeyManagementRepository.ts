import CustomerKey from '../../models/key-management/CustomerKey';
import DataKey from '../../models/key-management/DataKey';

export default interface KeyManagementRepository {
    tenantId: string;
    keyStore: any;

    /**
     * Create a customer master key alias from a CMK
     *
     * @param keyId
     */
    createKeyAlias(keyId: string): Promise<void>;

    /**
     * Create a Customer Master Key (CMK)
     */
    createCustomerKey(): Promise<CustomerKey>;

    /**
     * Find an existing customer key
     */
    findExistingCustomerKey(): Promise<CustomerKey>;

    /**
     * Get the key alias
     */
    getKeyAlias(): string;

    /**
     * Create a data key
     *
     * @param keyId - Customer managed key id
     */
    createDataKey(keyId: string): Promise<DataKey>;

    /**
     * Decrypt a data key
     *
     * @param keyId 
     * @param encryptedDataKay 
     */
    decryptDataKey(keyId: string, encryptedDataKay: string): Promise<DataKey>;
}
