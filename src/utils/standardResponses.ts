import { Request, Response, NextFunction } from 'express';

/**
 * Standard JSON response object
 */
const jsonResponse = () => {
    return (req: Request, res: Response, next: NextFunction) : void => {

        res.jsonResponse = (data: any = null, errors: string[] = [], success: boolean = true, status: number = 200) => {
            return res.status(status).json({ data, errors, success });
        };

        next();
    };
};

export { jsonResponse };
