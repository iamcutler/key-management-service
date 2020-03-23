import {Request, Response, NextFunction} from 'express';
import KeyManagementRepositoryImpl from '../../domain/key-management/KeyManagementRepository/KeyManagementRepositoryImpl';
import { Controller, Post, Req, Res, Next, UseFilters } from '@nestjs/common';
import { KeyManagementProviderExceptionFilter } from '../../domain/key-management/exceptions/KeyManagementProvider/KeyManagementProvider.filter';
import { CustomerKeyNotFoundExceptionFilter } from '../../domain/key-management/exceptions/CustomerKeyNotFound/CustomerKeyNotFound.filter';

@Controller('/keys')
export default class KeyManagementController {
    /**
     * Create a customer custom managed key
     *
     * @param req
     * @param res
     * @param next
     */
    @Post('/create')
    @UseFilters(
        new KeyManagementProviderExceptionFilter(),
        new CustomerKeyNotFoundExceptionFilter(),
    )
    async createCustomerKey(@Req() req: Request, @Res() res: Response) {
        const customerId = 'a7517684-73f5-4ab2-a016-a24f0cf9f999';
        const provider: any = req.headers.provider;

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
}
