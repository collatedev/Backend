import IValidationSchema from "./IValidationSchema";
import ITypeConfiguration from "./ITypeConfiguration";
import IllegalSchemaError from "./IllegalSchemaError";
import TypeConfiguration from "./TypeConfiguration";
import IFieldConfiguration from "./IFieldConfiguration";

const TypeNameKeywords : string[] = [
    "string", "number", "boolean", "enum", "any"
];

export default class ValidationSchema implements IValidationSchema {
    private types : Map<string, ITypeConfiguration>;

    constructor(json: any) {
        if (json === null) {
            throw new IllegalSchemaError("All schemas must not be null");
        }
        if (typeof json !== 'object') {
            throw new IllegalSchemaError(`All schemas must be valid json. Received: ${json}`);
        }
        if (!json.hasOwnProperty("types")) {
            throw new IllegalSchemaError("All schemas must begin with the 'types' property");
        }
        if (json.types === null) {
            throw new IllegalSchemaError("Types key can not be null, must be an empty object instead");
        }
        if (typeof json.types !== 'object') {
            throw new IllegalSchemaError("Types must be an object");
        }
        
        this.types = new Map<string, ITypeConfiguration>();

        for (const type of Object.keys(json.types)) {
            const typeConfiguration : any = json.types[type];
            this.types.set(type, new TypeConfiguration(typeConfiguration));
        }

        for (const type of this.getTypes()) {
            const typeConfiguration : ITypeConfiguration = this.getTypeConfiguration(type);
            for (const field of typeConfiguration.getFields()) {
                const fieldConfiguration : IFieldConfiguration = typeConfiguration.getConfiguration(field);
                if (this.isUndefinedType(fieldConfiguration.type)) {
                    throw new IllegalSchemaError(`Undefined type: ${fieldConfiguration.type}`);
                }
            }
        }
    }

    private isUndefinedType(type : string) : boolean {
        return !this.hasType(type) && !TypeNameKeywords.includes(type) && !this.isArray(type);
    }

    private isArray(type : string) : boolean {
        if (!type.startsWith("array[") || !type.endsWith("]")) {
            return false;
        }

        let numberOfNestedArrays : number = 0;
        while (type.includes("array[")) {
            type = type.replace("array[", "");
            numberOfNestedArrays++;
        }

        const closingBrackets : string = type.substring(type.indexOf("]"), type.length);
        type = type.substring(0, type.indexOf("]"));

        if (type.length === 0 || type.includes("[")) {
            return false;
        }

        if (closingBrackets.length !== numberOfNestedArrays) {
            return false;
        }
        
        for (let i : number = 0; i < numberOfNestedArrays; i++) {
            if (closingBrackets.charAt(i) !== ']') {
                return false;
            }
        }
        return true;
    }

    public getTypeConfiguration(type: string): ITypeConfiguration {
        if (!this.hasType(type)) {
            throw new IllegalSchemaError(`type '${type} is not defined in the schema'`);
        }
        return this.types.get(type) as ITypeConfiguration;
    }    
    
    public getTypes(): string[] {
        const keys : string[] = [];
        for (const key of this.types.keys()) {
            keys.push(key);
        }
        return keys;
    }

    public hasType(type: string): boolean {
        return this.types.has(type);
    }
}