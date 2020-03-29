import { Test } from '@nestjs/testing';
import { request } from 'express';
import DataKeyManagementController from './DataKeyManagement.controller';
import KeyManagementRepositoryImpl from '../../domain/key-management/KeyManagementRepository/KeyManagementRepositoryImpl';
import { KeyManagementProvider } from '../../domain/key-management/KeyManagementProvider';
import mock from '../../../test/mock';
import KeyManagementRequestHeaders from '../../domain/key-management/dto/KeyManagementRequestHeaders';
import DecryptDataKeyRequest from '../../domain/key-management/dto/DecryptDataKeyRequest';

const { response } = mock();

describe('Controller: Data Key Management', () => {
    let dataKeyManagementController: DataKeyManagementController;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [],
            controllers: [DataKeyManagementController],
            providers: [],
        }).compile();
    
        dataKeyManagementController = moduleRef.get<DataKeyManagementController>(DataKeyManagementController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createDataKey', () => {
        // given
        const tenantId: string = 'testing';
        const mockDataKey = {
            keyId: tenantId,
            plainText: '567567676756757667'
        };

        describe('Provider: AWS', () => {
            // given
            const keyAlias: string = tenantId;
            const headers = new KeyManagementRequestHeaders();
            headers.provider = KeyManagementProvider.AWS;
            headers.authorization = '75667567645345345u65567';

            beforeEach(async () => {
                // given
                jest.spyOn(KeyManagementRepositoryImpl.prototype, 'createDataKey').mockResolvedValue(mockDataKey);
                // when
                await dataKeyManagementController.createDataKey(headers, keyAlias, request, response);
            });

            it('should call the key management implementation to fcreate a data key', async () => {
                // given
                // when
                // then
                expect(KeyManagementRepositoryImpl.prototype.createDataKey).toHaveBeenCalledWith(keyAlias);
            });

            it('should return the data key with the standard response', async () => {
                // given
                // when
                // then
                expect(response.jsonResponse).toHaveBeenCalledWith(mockDataKey);
            });
        });
    });

    describe('decryptDataKey', () => {
        // given
        const tenantId: string = 'testing';
        const mockDataKey = {
            keyId: tenantId,
            plainText: '567567676756757667'
        };

        describe('Provider: AWS', () => {
            // given
            const keyAlias: string = tenantId;
            const headers = new KeyManagementRequestHeaders();
            headers.provider = KeyManagementProvider.AWS;
            headers.authorization = '75667567645345345u65567';
            const body = new DecryptDataKeyRequest();
            body.cipherText = '756768675455467567567';

            beforeEach(async () => {
                // given
                jest.spyOn(KeyManagementRepositoryImpl.prototype, 'decryptDataKey').mockResolvedValue(mockDataKey);
                // when
                await dataKeyManagementController.decryptDataKey(headers, keyAlias, body, request, response);
            });

            it('should call the key management implementation to fcreate a data key', async () => {
                // given
                // when
                // then
                expect(KeyManagementRepositoryImpl.prototype.decryptDataKey).toHaveBeenCalledWith(
                    keyAlias, body.cipherText
                );
            });

            it('should return the decrypted data key with the standard response', async () => {
                // given
                // when
                // then
                expect(response.jsonResponse).toHaveBeenCalledWith(mockDataKey);
            });
        });
    });
});
