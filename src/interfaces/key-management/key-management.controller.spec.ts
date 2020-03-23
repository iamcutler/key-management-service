import { Test } from '@nestjs/testing';
import { request, response } from 'express';
import KeyManagementController from './key-management.controller';
import KeyManagementRepositoryImpl from '../../../dist/domain/key-management/KeyManagementRepository/KeyManagementRepositoryImpl';
import { KeyManagementProvider } from '../../domain/key-management/KeyManagementProvider';

jest.mock('../../../dist/domain/key-management/KeyManagementRepository/KeyManagementRepositoryImpl');

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
        const customerId = 'testing';

        describe.skip('Provider: KMS', () => {
            // given
            const provider: KeyManagementProvider = KeyManagementProvider.KMS;

            beforeEach(() => {
                jest.spyOn(KeyManagementRepositoryImpl.prototype, 'getKeyAlias').mockReturnValue(`alias/${customerId}`);
            });

            it('should check and return the customer key if it already exists', async () => {
                // given
                jest.spyOn(KeyManagementRepositoryImpl.prototype, 'findExistingCustomerKey').mockRejectedValue({
                    keyId: '54675675675646534'
                });
                //response.set('provider', provider);
                // when
                //await keyManagementController.createCustomerKey(request, response)
                // then
                expect(response.send).toHaveBeenCalledWith('OK');
            });
        });
    });
});
