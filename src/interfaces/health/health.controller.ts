import { Request, Response } from 'express';
import { Get, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@Controller('/health')
@ApiTags('Health')
export default class HealthController {
    constructor(
        private health: HealthCheckService,
    ) {}

    /**
     * Get the health of the application
     *
     * @param req
     * @param res
     * @param next
     */
    @Get()
    @HealthCheck()
    async check() {
        return this.health.check([]);
    }
}
