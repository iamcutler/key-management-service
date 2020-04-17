import { Request, Response } from 'express';
import KeyManagementRepositoryImpl from '../../domain/key-management/KeyManagementRepository/KeyManagementRepositoryImpl';
import { Controller, Post, Req, Res, UseFilters, Headers } from '@nestjs/common';
import { KeyManagementProviderExceptionFilter } from '../../domain/key-management/exceptions/KeyManagementProvider/KeyManagementProvider.filter';
import { CustomerKeyNotFoundExceptionFilter } from '../../domain/key-management/exceptions/CustomerKeyNotFound/CustomerKeyNotFound.filter';
import KeyManagementRequestHeaders from '../../domain/key-management/dto/KeyManagementRequestHeaders';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@Controller('/customer-keys')
@ApiTags('CMK')
@ApiHeader({ name: 'authorization', description: 'JWT authentication token or tenantId if CR Automation is disabled' })
@ApiHeader({ name: 'provider', description: 'Key Management Provider (e.g. AWS)' })
export default class CustomerKeyManagementController {
    /**
     * Create a customer custom managed key
     *
     * @param req
     * @param res
     */
    @Post('/')
    @UseFilters(
        new KeyManagementProviderExceptionFilter(),
        new CustomerKeyNotFoundExceptionFilter(),
    )
    async createCustomerKey(
        @Headers() headers: KeyManagementRequestHeaders,
        @Req() req: Request, @Res() res: Response
    ) {
        const provider: any = headers.provider;
        const keyService = new KeyManagementRepositoryImpl(req.tenantId, provider);
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
