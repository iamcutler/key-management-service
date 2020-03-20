import {Request, Response, NextFunction} from 'express';
import KeyManagementAWSImpl from '../../domain/key-management/KeyManagementAWSImpl';

export default class KeyManagementController {
    /**
     * Create a customer custom managed key
     *
     * @param req
     * @param res
     * @param next
     */
    static async createCustomerKey(req: Request, res: Response, next: NextFunction) {
        const keyService = new KeyManagementAWSImpl();
        const customerId = process.env.TENANT_ID || '';
        const aliasName = `alias/${customerId}`;

        // check if the tenant key already exists
        try {
            const existingKey = await keyService.findExistingCustomerKey(customerId);

            // return the existing key if found
            return res.json({
                keyId: existingKey.keyId,
                alias: aliasName
            });
        }
        catch(err) {
            // create a new customer key since one wasn't found
            const key = await keyService.createCustomerKey(customerId);
            // create a key alias
            await keyService.createKeyAlias(customerId, key.keyId);

            res.json({
                keyId: key.keyId,
                alias: aliasName
            });
        }
    }
}
