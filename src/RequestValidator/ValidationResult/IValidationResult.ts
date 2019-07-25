import IValidationError from "./IValidationError";

export default interface IValidationResult {
    isValid(): boolean;
    errors(): IValidationError[];
    join(validationResult : IValidationResult) : void;
}