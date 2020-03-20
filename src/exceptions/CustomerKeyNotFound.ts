/**
 * CustomerKeyNotFound
 * @description custom expection for customer keys when not found
 */
export default class CustomerKeyNotFound extends Error {
    public constructor(message: string) {
        super(message);
    }
}
