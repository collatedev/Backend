import IValidationResult from "../ValidationResult/IValidationResult";
import ITypeConfiguration from "../ValidationSchema/ITypeConfiguration";

export default interface ISanitizer {
    sanitize(value : any, configuration : ITypeConfiguration) : IValidationResult;
}