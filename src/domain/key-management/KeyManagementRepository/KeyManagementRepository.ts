import CustomerKey from '../../models/key-management/CustomerKey';

export default interface KeyManagementRepository {
    customerId: string;
    keyStore: any;

    /**
     * Create a customer master key alias from a CMK
     *
     * @param keyId
     */
    createKeyAlias(keyId: string) : Promise<void>;

    /**
     * Create a Customer Master Key (CMK)
     */
    createCustomerKey() : Promise<CustomerKey>;

    /**
     * Find an existing customer key
     */
    findExistingCustomerKey() : Promise<CustomerKey>;

    /**
     * Get the key alias
     */
    getKeyAlias() : string;
}
