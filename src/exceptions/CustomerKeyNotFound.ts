/**
 * CustomerKeyNotFound
 * @description custom expection for customer keys when not found
 */
export default class CustomerKeyNotFound extends Error {
    constructor(message: string) {
        super(message);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, CustomerKeyNotFound.prototype);
    }
}
