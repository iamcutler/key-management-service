/**
 * Key Management Provider Expectation
 */
export default class KeyManagementProviderException extends Error {
    constructor(message: string) {
        super(message);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, KeyManagementProviderException.prototype);
    }
}
