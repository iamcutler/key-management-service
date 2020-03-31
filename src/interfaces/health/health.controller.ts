import { Request, Response } from 'express';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('/health')
@ApiTags('Health')
export default class HealthController {

    /**
     * Get the health of the application
     *
     * @param req
     * @param res
     * @param next
     */
    @Get()
    getHealth(@Req() req: Request, @Res() res: Response) {
        res.send('OK');
    }
}
