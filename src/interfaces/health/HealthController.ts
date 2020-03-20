import { Request, Response } from 'express';

export default class HealthController {

    /**
     * Get the health of the application
     *
     * @param req
     * @param res
     * @param next
     */
    static async getHealth(req: Request, res: Response) {
        res.send('OK');
    }
}
