import IErrorHandler from "./IErrorHandler";
import ErrorType from "./ErrorType";
import IValidationError from "../ValidationResult/IValidationError";
import IPathBuilder from "../PathBuilder/IPathBuilder";

export default abstract class ErrorHandler implements IErrorHandler {
    private errors : IValidationError[];
    private pathBuilder : IPathBuilder;

    constructor(pathBuilder : IPathBuilder) {
        this.errors = [];
        this.pathBuilder = pathBuilder;
    }

    public abstract handleError(values : any[], type : ErrorType) : void;

    protected addError(message : string) : void {
        this.errors.push({
            message,
            location: this.pathBuilder.getPath()
        });
    }

    protected getPathBuilder() : IPathBuilder {
        return this.pathBuilder;
    }

    public hasErrors(): boolean {
        return this.errors.length > 0;
    }

    public getErrors(): IValidationError[] {
        return this.errors;
    }

    public join(otherHandler : IErrorHandler) : void {
        for (const error of otherHandler.getErrors()) {
            this.errors.push(error);
        }
    }
}