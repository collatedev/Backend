import IFieldConfiguration from "./IFieldConfiguration";

export default interface ITypeConfiguration {
    getFields() : string[];
    hasField(field : string) : boolean;
    getConfiguration(field : string) : IFieldConfiguration;
}