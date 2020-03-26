import { HttpException } from '@nestjs/common';
import { UNAUTHORIZED } from 'http-status';

export default class AuthenticationException extends HttpException {
    constructor(message: string) {
        super(message, UNAUTHORIZED);
    }
}
