import IValidationResult from "./IValidationResult";
import IValidationError from "./IValidationError";
import IErrorHandler from "../ErrorHandler/IErrorHandler";

export default class ValidationResult implements IValidationResult {
    private readonly errorHandler : IErrorHandler;

    constructor(errorHandler : IErrorHandler) {
        this.errorHandler = errorHandler;
    }

    public isValid(): boolean {
        return !this.errorHandler.hasErrors();
    }   
    
    public errors(): IValidationError[] {
        return this.errorHandler.getErrors();
    }

    public join(validationResult : ValidationResult) : void {
        this.errorHandler.join(validationResult.errorHandler);
    }
}