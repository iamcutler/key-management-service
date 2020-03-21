import {Request, Response, NextFunction} from 'express';
import KeyManagementRepositoryImpl from '../../domain/key-management/KeyManagementRepositoryImpl';

export default class KeyManagementController {
    /**
     * Create a customer custom managed key
     *
     * @param req
     * @param res
     * @param next
     */
    static async createCustomerKey(req: Request, res: Response, next: NextFunction) {
        const customerId = process.env.TENANT_ID || '';
        const provider: any = req.headers.provider;

        try {
            const keyService = new KeyManagementRepositoryImpl(customerId, provider);
            const aliasName = keyService.getKeyAlias();

            // check if the tenant key already exists
            try {
                const {keyId} = await keyService.findExistingCustomerKey();

                // return the existing key if found
                return res.jsonResponse({
                    keyId,
                    alias: aliasName
                });
            }
            catch(err) {
                // create a new customer key since one wasn't found
                const {keyId} = await keyService.createCustomerKey();
                // create a key alias
                await keyService.createKeyAlias(keyId);

                res.jsonResponse({
                    keyId,
                    alias: aliasName
                });
            }
        }
        catch (err) {
            next(err);
        }
    }
}
