import { Request, Response } from 'express';
import { Controller, Get, Req, Res } from '@nestjs/common';

@Controller('/health')
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
