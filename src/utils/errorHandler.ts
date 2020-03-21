import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import {
    BAD_REQUEST,
    INTERNAL_SERVER_ERROR
} from 'http-status';
import KeyManagementProviderException from '../exceptions/KeyManagementProviderException';

/**
 * Construct error message
 *
 * @param err
 */
const getErrorMessage = (err: any): string[] => {
    if (!err) return []; // return null to api response if no error is present
    if (err instanceof Error) {
        return [err.message];
    }

    return [err];
};

/**
 * Application exception handler
 */
const appErrorHandler = () => {
    return (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) : Response => {
        // tslint:disable-next-line:no-console
        console.error(err);

        if(err instanceof KeyManagementProviderException) return res.jsonResponse(null, [err.message], false, BAD_REQUEST);

        return res.jsonResponse(null, getErrorMessage(err), false, INTERNAL_SERVER_ERROR);
    };
};

export {
    appErrorHandler,
    getErrorMessage
};
