import IValidationResult from "../ValidationResult/IValidationResult";
import ITypeConfiguration from "../ValidationSchema/ITypeConfiguration";

export default interface ITypeChecker {
    typeCheck(value : any, configuration : ITypeConfiguration) : IValidationResult;
}