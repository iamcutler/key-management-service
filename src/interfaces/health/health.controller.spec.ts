import { Test } from '@nestjs/testing';
import { request, response } from 'express';
import HealthController from './health.controller';

describe('Controller: Health', () => {
    let healthController: HealthController;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [HealthController],
            providers: [],
        }).compile();
    
        healthController = moduleRef.get<HealthController>(HealthController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getHealth', () => {
        it('should return a OK status', async () => {
            // given
            jest.spyOn(response, 'send').mockReturnThis();
            // when
            healthController.getHealth(request, response)
            // then
            expect(response.send).toHaveBeenCalledWith('OK');
        });
    });
});
