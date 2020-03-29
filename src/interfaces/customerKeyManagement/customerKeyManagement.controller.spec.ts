import { Test } from '@nestjs/testing';
import { request } from 'express';
import CustomerKeyManagementController from './customerKeyManagement.controller';
import KeyManagementRepositoryImpl from '../../domain/key-management/KeyManagementRepository/KeyManagementRepositoryImpl';
import { KeyManagementProvider } from '../../domain/key-management/KeyManagementProvider';
import mock from '../../../test/mock';
import KeyManagementRequestHeaders from '../../domain/key-management/dto/KeyManagementRequestHeaders';

const { response } = mock();

describe('Controller: Key Management', () => {
    let keyManagementController: CustomerKeyManagementController;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [],
            controllers: [CustomerKeyManagementController],
            providers: [],
        }).compile();
    
        keyManagementController = moduleRef.get<CustomerKeyManagementController>(CustomerKeyManagementController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createCustomerKey', () => {
        // given
        const tenantId: string = 'testing';
        const keyId: string = '466477565477456';

        describe('Provider: AWS', () => {
            // given
            const aliasName: string = `alias/${tenantId}`;
            const headers = new KeyManagementRequestHeaders();
            headers.provider = KeyManagementProvider.AWS;
            headers.authorization = '75667567645345345u65567';

            beforeEach(() => {
                jest.spyOn(KeyManagementRepositoryImpl.prototype, 'getKeyAlias').mockReturnValue(aliasName);
            });

            describe('Existing customer key exists:', () => {
                beforeEach(() => {
                    // given
                    jest.spyOn(KeyManagementRepositoryImpl.prototype, 'findExistingCustomerKey').mockResolvedValue({
                        keyId,
                    });
                });

                it('should call the key management implementation to find the existing key', async () => {
                    // given
                    // when
                    await keyManagementController.createCustomerKey(headers, request, response);
                    // then
                    expect(KeyManagementRepositoryImpl.prototype.findExistingCustomerKey).toHaveBeenCalled();
                });

                it('should return the customer key and alias', async () => {
                    // given
                    // when
                    await keyManagementController.createCustomerKey(headers, request, response);
                    // then
                    expect(response.jsonResponse).toHaveBeenCalledWith({
                        keyId,
                        alias: aliasName,
                    });
                });
            });

            describe('New customer key generated:', () => {
                beforeEach(() => {
                    // given
                    jest.spyOn(KeyManagementRepositoryImpl.prototype, 'findExistingCustomerKey').mockRejectedValue({});
                    jest.spyOn(KeyManagementRepositoryImpl.prototype, 'createCustomerKey').mockResolvedValue({
                        keyId
                    });
                    jest.spyOn(KeyManagementRepositoryImpl.prototype, 'createKeyAlias').mockResolvedValue(null);
                });

                it('should call the implementation to create a customer key', async () => {
                    // given
                    // when
                    await keyManagementController.createCustomerKey(headers, request, response);
                    // then
                    expect(KeyManagementRepositoryImpl.prototype.createCustomerKey).toHaveBeenCalledWith();
                });

                it('should call the implementation to create a key alias from the new key', async () => {
                    // given
                    // when
                    await keyManagementController.createCustomerKey(headers, request, response);
                    // then
                    expect(KeyManagementRepositoryImpl.prototype.createKeyAlias).toHaveBeenCalledWith(keyId);
                });

                it('should return the new customer key and alias', async () => {
                    // given
                    // when
                    await keyManagementController.createCustomerKey(headers, request, response);
                    // then
                    expect(response.jsonResponse).toHaveBeenCalledWith({
                        keyId,
                        alias: aliasName,
                    });
                });
            });
        });
    });
});
