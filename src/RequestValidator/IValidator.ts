import IValidationResult from "./ValidationResult/IValidationResult";
import IRequest from "./Request/IRequest";
import IValidationSchema from "./ValidationSchema/IValidationSchema";

export default interface IValidator {
    validate(request : IRequest, schema : IValidationSchema) : IValidationResult;
}