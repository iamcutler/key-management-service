import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

/**
 * Application exception handler
 */
const appErrorHandler = () => {
    return (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) : Response => {
        // tslint:disable-next-line:no-console
        console.error(err);

        return res.jsonResponse(null, [], false, 500);
    };
};

export {
    appErrorHandler
};
