import { Controller, Post, UseFilters, Req, Res, Body, Headers, Param } from "@nestjs/common";
import { Request, Response } from 'express';
import KeyManagementRepositoryImpl from '../../domain/key-management/KeyManagementRepository/KeyManagementRepositoryImpl';
import { KeyManagementProviderExceptionFilter } from '../../domain/key-management/exceptions/KeyManagementProvider/KeyManagementProvider.filter';
import DecryptDataKeyRequest from '../../domain/key-management/dto/DecryptDataKeyRequest.dto';
import KeyManagementRequestHeaders from "../../domain/key-management/dto/KeyManagementRequestHeaders";
import DataKey from '../../domain/models/key-management/DataKey';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { KeyManagementProvider } from '../../domain/key-management/KeyManagementProvider';

@Controller('/customer-keys/:keyAlias/data-keys')
@UseFilters(new KeyManagementProviderExceptionFilter())
@ApiTags('Data Keys')
@ApiHeader({ name: 'authorization', description: 'JWT authentication token' })
@ApiHeader({ name: 'provider', description: 'Key Management Provider (e.g. AWS)' })
export default class DataKeyManagementController {
    /**
     * Create a customer data key
     * @description Use a CMK alias to generate a associated data key
     *
     * @param headers
     * @param keyAlias
     * @param req
     * @param res
     */
    @Post('/')
    async createDataKey(
        @Headers() headers: KeyManagementRequestHeaders,
        @Param('keyAlias') keyAlias: string,
        @Req() req: Request, @Res() res: Response
    ) {
        const provider: KeyManagementProvider = headers.provider;
        
        const keyService = new KeyManagementRepositoryImpl(req.tenantId, provider);

        // create the dataKey
        const dataKey: DataKey = await keyService.createDataKey(keyAlias);

        res.jsonResponse(dataKey);
    }

    /**
     * Decrypt data key
     *
     * @param headers
     * @param keyAlias
     * @param decryptDataKey
     * @param req
     * @param res
     */
    @Post('/decrypt')
    async decryptDataKey(
        @Headers() headers: KeyManagementRequestHeaders,
        @Param('keyAlias') keyAlias: string,
        @Body() decryptDataKey: DecryptDataKeyRequest,
        @Req() req: Request, @Res() res: Response
    ) {
        const provider: any = headers.provider;
        const { cipherText }: DecryptDataKeyRequest = decryptDataKey;
        
        const keyService = new KeyManagementRepositoryImpl(req.tenantId, provider);
        // decrypt the encryped data key
        const key: DataKey = await keyService.decryptDataKey(keyAlias, cipherText);

        res.jsonResponse(key);
    }
}