import { HttpException } from '@nestjs/common';
import { NOT_FOUND } from 'http-status';

/**
 * CustomerKeyNotFound
 * @description custom expection for customer keys when not found
 */
export default class CustomerKeyNotFoundException extends HttpException {
    constructor(message: string) {
        super(message, NOT_FOUND);
    }
}
