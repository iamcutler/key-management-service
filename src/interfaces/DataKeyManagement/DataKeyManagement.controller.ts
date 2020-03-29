import { Controller, Post, UseFilters, Req, Res } from "@nestjs/common";
import { Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';
import { CustomerKeyNotFoundExceptionFilter } from '../../domain/key-management/exceptions/CustomerKeyNotFound/CustomerKeyNotFound.filter';
import KeyManagementRepositoryImpl from '../../domain/key-management/KeyManagementRepository/KeyManagementRepositoryImpl';
import { KeyManagementProviderExceptionFilter } from '../../domain/key-management/exceptions/KeyManagementProvider/KeyManagementProvider.filter';
import DecryptDataKeyRequest from '../../domain/models/key-management/DecryptDataKeyRequest';

@Controller('/data-keys')
@UseFilters(
    new KeyManagementProviderExceptionFilter(),
)
export default class DataKeyManagementController {
    /**
     * Create a customer data key
     * @description Use a CMK alias to generate a associated data key
     *
     * @param req
     * @param res
     */
    @Post('/:keyAlias')
    async createDataKey(@Req() req: Request, @Res() res: Response) {
        const headers: IncomingHttpHeaders = req.headers;
        const provider: any = headers.provider;
        const keyAlias: string = req.params.keyAlias;
        
        const keyService = new KeyManagementRepositoryImpl(req.tenantId, provider);

        // create the dataKey
        const dataKey = await keyService.createDataKey(keyAlias);

        res.jsonResponse(dataKey);
    }

    @Post('/:keyAlias/decrypt')
    async decryptDataKey(@Req() req: Request, @Res() res: Response) {
        const headers: IncomingHttpHeaders = req.headers;
        const provider: any = headers.provider;
        const keyAlias: string = req.params.keyAlias;
        const { cipherText }: DecryptDataKeyRequest = req.body;
        
        const keyService = new KeyManagementRepositoryImpl(req.tenantId, provider);
        // decrypt the encryped data key
        const key = await keyService.decryptDataKey(keyAlias, cipherText);

        res.jsonResponse(key);
    }
}