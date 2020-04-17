import { Test } from '@nestjs/testing';
import { TerminusModule } from '@nestjs/terminus';
import HealthController from './health.controller';

describe('Controller: Health', () => {
    let healthController: HealthController;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                TerminusModule
            ],
            controllers: [
                HealthController
            ],
            providers: [],
        }).compile();
    
        healthController = moduleRef.get<HealthController>(HealthController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('check', () => {
        it('should return a OK status', async () => {
            // given
            // when
            const result = await healthController.check();
            // then
            expect(result).toEqual({
                details: {},
                error: {},
                info: {},
                status: 'ok'
            });
        });
    });
});
