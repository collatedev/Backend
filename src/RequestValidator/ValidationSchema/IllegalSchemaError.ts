export default class IllegalSchemaError extends Error {
    constructor(message : string) {
        super(message);
    }
}