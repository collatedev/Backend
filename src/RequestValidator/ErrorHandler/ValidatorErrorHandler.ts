import ErrorHandler from "./ErrorHandler";
import ErrorType from "./ErrorType";

export default class ValidatorErrorHandler extends ErrorHandler {
    public handleError(values: any[], type : ErrorType) : void {
        switch(type) {
            case ErrorType.UnknownType:
                this.addUnknownTypeError(values[0]);
                break;
            case ErrorType.MissingField:
                this.addMisingPropertyError(values[0]);
                break;
            case ErrorType.UnexpectedField:
                this.addUnexpectedPropertyError(values[0]);
                break;
            case ErrorType.IncorrectType:
                this.addTypeError(values[0], values[1]);
                break;
            default:
                throw new TypeError(`Unexpected error type ${type}`);
        }
    }

    private addUnknownTypeError(typeName: string): void {
        this.addError(`Unknown type '${typeName}'`);
    }    
    
    private addMisingPropertyError(field: string): void {
        this.addError(`Missing property '${field}'`);
    }

    private addUnexpectedPropertyError(field: string): void {
        this.addError(`Unexpected property '${field}'`);
    }

    private addTypeError(fieldName: string, fieldType: string): void {
        this.addError(
            `Property '${fieldName}${this.getPathBuilder().getCurrentIndex()}' should be type '${fieldType}'`
        );
    }
}