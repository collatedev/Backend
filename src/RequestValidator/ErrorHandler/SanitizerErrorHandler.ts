import ErrorHandler from "./ErrorHandler";
import IPathBuilder from "../PathBuilder/IPathBuilder";
import ErrorType from "./ErrorType";

export default class SanitizerErrorHandler extends ErrorHandler {
    constructor(pathBuilder : IPathBuilder) {
        super(pathBuilder);
    }

    public handleError(values : any[], type : ErrorType) : void {
        switch (type) {
            case ErrorType.IllegalEnumValue:
                this.addError(`Illegal enum value '${values[0]}', acceptable values are '${values[1]}'`);
                break;
            case ErrorType.OutOfRangeError:
                this.addError(`Value '${values[0]}' is outside of the range [${values[1]}]`);
                break;
            case ErrorType.IllegalURLError:
                this.addError(`Value '${values[0]}' is not a valid URL`);
                break;
            case ErrorType.DoesNotStartWithError:
                this.addError(`Value '${values[0]}' does not start with '${values[1]}'`);
                break;
            case ErrorType.IllegalLengthError:
                const expectedLengthIndex : number = 2;
                this.addError(
                    `Length of '${values[0]}' is ${values[1]} when it should be ${values[expectedLengthIndex]}`
                );
                break;
            case ErrorType.IllegalArrayLength:
                const expectedArrayLengthIndex : number = 2;
                this.addError(
                    `Array length of '${values[0]}' is ${values[1]}` +
                    ` when it should be ${values[expectedArrayLengthIndex]}`
                );
                break;
            default:
                throw new TypeError(`Unknown error type ${type}`);
        }
    }
}