import IValidationError from "../ValidationResult/IValidationError";
import ErrorType from "../ErrorHandler/ErrorType";

export default interface IErrorHandler {
    handleError(values: any[], type : ErrorType) : void;
    hasErrors() : boolean;
    getErrors() : IValidationError[];
    join(otherHandler : IErrorHandler) : void;
}