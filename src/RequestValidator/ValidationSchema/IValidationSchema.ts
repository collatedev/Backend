import ITypeConfiguration from "./ITypeConfiguration";

export default interface IValidationSchema {
    getTypeConfiguration(type : string) : ITypeConfiguration;
    getTypes() : string[];
    hasType(type : string) : boolean;
}