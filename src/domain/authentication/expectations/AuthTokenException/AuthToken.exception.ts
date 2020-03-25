import { HttpException } from '@nestjs/common';
import { BAD_REQUEST } from 'http-status';

export default class AuthTokenException extends HttpException {
    /**
     * @constructor
     * @param message
     */
    constructor(message: string) {
        super(message, BAD_REQUEST);
    }
}
