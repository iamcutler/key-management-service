import { Test } from '@nestjs/testing';
import { request } from 'express';
import KeyManagementController from './key-management.controller';
import KeyManagementRepositoryImpl from '../../domain/key-management/KeyManagementRepository/KeyManagementRepositoryImpl';
import { KeyManagementProvider } from '../../domain/key-management/KeyManagementProvider';
import mock from '../../../test/mock';

const { response } = mock();

describe('Controller: Key Management', () => {
    let keyManagementController: KeyManagementController;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [],
            controllers: [KeyManagementController],
            providers: [],
        }).compile();
    
        keyManagementController = moduleRef.get<KeyManagementController>(KeyManagementController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createCustomerKey', () => {
        // given
        const tenantId: string = 'testing';
        const keyId: string = '466477565477456';

        describe('Provider: KMS', () => {
            // given
            const provider: KeyManagementProvider = KeyManagementProvider.AWS;
            const aliasName: string = `alias/${tenantId}`;

            request.headers = {
                provider,
            };

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
                    await keyManagementController.createCustomerKey(request, response);
                    // then
                    expect(KeyManagementRepositoryImpl.prototype.findExistingCustomerKey).toHaveBeenCalled();
                });

                it('should return the customer key and alias', async () => {
                    // given
                    // when
                    await keyManagementController.createCustomerKey(request, response);
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
                    await keyManagementController.createCustomerKey(request, response);
                    // then
                    expect(KeyManagementRepositoryImpl.prototype.createCustomerKey).toHaveBeenCalledWith();
                });

                it('should call the implementation to create a key alias from the new key', async () => {
                    // given
                    // when
                    await keyManagementController.createCustomerKey(request, response);
                    // then
                    expect(KeyManagementRepositoryImpl.prototype.createKeyAlias).toHaveBeenCalledWith(keyId);
                });

                it('should return the new customer key and alias', async () => {
                    // given
                    // when
                    await keyManagementController.createCustomerKey(request, response);
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
