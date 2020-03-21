import { Request, Response, NextFunction } from 'express';
import {OK} from 'http-status';

/**
 * Standard JSON response object
 */
const jsonResponse = () => {
    return (req: Request, res: Response, next: NextFunction) : void => {

        res.jsonResponse = (data: any = null, errors: string[] = [], success: boolean = true, status: number = OK) => {
            return res.status(status).json({ data, errors, success });
        };

        next();
    };
};

export { jsonResponse };
