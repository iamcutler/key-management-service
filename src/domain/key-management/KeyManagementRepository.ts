import CustomerKey from '../models/key-management/CustomerKey';

export default interface KeyManagementRepository {
    keyStore: any;

    /**
     * Create a customer master key alias from a CMK
     * @param {string} customerId
     * @param {string} keyId
     */
    createKeyAlias(customerId: string, keyId: string) : Promise<void>;

    /**
     * Create a Customer Master Key (CMK)
     *
     * @param {string} tenantId
     */
    createCustomerKey(customerId: string) : Promise<CustomerKey>;

    /**
     * Find an existing customer key
     *
     * @param customerId
     */
    findExistingCustomerKey(customerId: string) : Promise<CustomerKey>;
}
