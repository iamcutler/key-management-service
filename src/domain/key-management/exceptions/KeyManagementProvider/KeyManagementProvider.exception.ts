import { HttpException } from '@nestjs/common';
import { BAD_REQUEST } from 'http-status';
/**
 * Key Management Provider Expectation
 */
export default class KeyManagementProviderException extends HttpException {
    constructor(message: string) {
        super(message, BAD_REQUEST);
    }
}
