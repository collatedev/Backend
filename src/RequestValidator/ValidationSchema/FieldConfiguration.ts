import IFieldConfiguration from "./IFieldConfiguration";
import IllegalSchemaError from "./IllegalSchemaError";
import IsType from "../Types/IsType";

const RangeLength : number = 2;
const ValidKeys : string[] = [
    "required", "type", "values", "range", "isURL", "startsWith", "length", "arrayLengths",
    "isInt"
];

export default class FieldConfiguration implements IFieldConfiguration {
    public readonly required : boolean;    
    public readonly type : string;
    public readonly range? : number[] | undefined;
    public readonly values? : string[] | undefined;
    public readonly isURL? : boolean | undefined;
    public readonly startsWith? : string | undefined;
    public readonly length? : number | undefined;
    public readonly arrayLengths? : number[] | undefined;
    public readonly isInt? : boolean | undefined;

    constructor(field : any) {
        this.validateField(field);
        this.checkForUnexpectedKeys(field);
        this.checkForRequiredKeys(field);

        this.required = field.required;
        this.type = field.type;
        this.range = this.getRange(field);
        this.isInt = this.getIsInt(field);
        this.values = this.getValues(field);
        this.isURL = this.getIsURL(field);
        this.startsWith = this.getStartsWith(field);
        this.length = this.getLength(field);
        this.arrayLengths = this.getArrayLengths(field);

        if (this.type === "enum" && !this.values) {
            throw new IllegalSchemaError('The type "enum" requires a "values" key in its field definition');
        }
    }

    private validateField(field : any) : void {
        if (field == null) {
            throw new IllegalSchemaError('The json configuration of a field must be non null');
        }
        if (typeof field !== 'object') {
            throw new IllegalSchemaError('The value passed to the constructor must be a json value');
        }
        if (Object.keys(field).length === 0) {
            throw new IllegalSchemaError('The json configuration must have keys "type" and "required"');
        }
    }

    private checkForRequiredKeys(field : any) : void {
        if (!field.hasOwnProperty("type")) {
            throw new IllegalSchemaError('The json configuration must have the "type" key');
        }
        if (!field.hasOwnProperty("required")) {
            throw new IllegalSchemaError('The json configuration must have the "required" key');
        }
        if (typeof field.type !== 'string') {
            throw new IllegalSchemaError('The key "type" must be a string');
        }
        if (typeof field.required !== 'boolean') {
            throw new IllegalSchemaError('The key "required" must be a boolean');
        }
    }

    private checkForUnexpectedKeys(field : any) : void {
        for (const key in field) {
            if (!ValidKeys.includes(key)) {
                throw new IllegalSchemaError(`Unexpected key "${key}" in the json`);
            }
        }
    }

    private getRange(field : any) : number[] | undefined {
        if (field.hasOwnProperty("range")) {
            if (this.type !== "number" && !this.isArrayOf("number")) {
                throw new IllegalSchemaError(
                    'The key "range" can only be used when the type is \'number\' or an array of \'number\''
                );
            }
            if (!Array.isArray(field.range)) {
                throw new IllegalSchemaError('The key "range" must be an array');
            }
            if (field.range.length !== RangeLength) {
                throw new IllegalSchemaError('The key "range" must be an array of size 2');
            }
            if (typeof field.range[0] !== 'number' || typeof field.range[1] !== 'number') {
                throw new IllegalSchemaError('The values in the "range" array must be numbers');
            }
            return field.range as number[];
        }
        return undefined;
    }

    private getIsInt(field : any) : boolean | undefined {
        if (field.hasOwnProperty("isInt")) {
            if (this.type !== "number" && !this.isArrayOf("number")) {
                throw new IllegalSchemaError(
                    'The key "isInt" can only be used when the type is \'number\' or an array of \'number\''
                );
            }
            if (!IsType.isTypeOf("boolean", field.isInt)) {
                throw new IllegalSchemaError('The key "isInt" must be a boolean');
            }
            return field.isInt as boolean;
        }
        return undefined;
    }

    private getValues(field : any) : string[] | undefined {
        if (field.hasOwnProperty("values")) {
            if (this.type !== "enum" && !this.isArrayOf("enum")) {
                throw new IllegalSchemaError(
                    'The key "values" can only be used when the type is \'enum\''
                );
            }
            if (!Array.isArray(field.values)) {
                throw new IllegalSchemaError('The key "values" must be an array');
            }
            if (field.values.length === 0) {
                throw new IllegalSchemaError('The key "values" must have at least one enum value');
            }
            for (const value of field.values) {
                if (typeof value !== 'string') {
                    throw new IllegalSchemaError('All values of the key "values" must be a string');
                }
            }
            return field.values as string[];
        }
        return undefined;
    }

    private getIsURL(field : any) : boolean | undefined {
        if (field.hasOwnProperty("isURL")) {
            if (typeof field.isURL !== "boolean") {
                throw new IllegalSchemaError('The key "isURL" must be a boolean');
            }
            if (this.type !== "string" && !this.isArrayOf("string")) {
                throw new IllegalSchemaError('The key "isURL" can only be used when the type is \'string\'');
            }
            return field.isURL as boolean;
        }
        return undefined;
    }

    private getStartsWith(field : any) : string | undefined {
        if (field.hasOwnProperty("startsWith")) {
            if (typeof field.startsWith !== 'string') {
                throw new IllegalSchemaError('The key "startsWith" must be a string');
            }
            if (this.type !== 'string' && !this.isArrayOf("string")) {
                throw new IllegalSchemaError('The key "startsWith" can only be used when the type is \'string\'');
            }
            return field.startsWith as string;
        }
        return undefined;
    }

    private getLength(field : any) : number | undefined {
        if (field.hasOwnProperty("length")) {
            if (typeof field.length !== 'number') {
                throw new IllegalSchemaError('The key "length" must be a number');
            }
            if (this.type !== 'string' && !this.isArrayOf("string")) {
                throw new IllegalSchemaError(
                    'The key "length" can only be used when the type is \'string\''
                );
            }
            return field.length as number;
        }
        return undefined;
    }

    private getArrayLengths(field : any) : number[] | undefined {
        if (field.hasOwnProperty("arrayLengths")) {
            if (!Array.isArray(field.arrayLengths)) {
                throw new IllegalSchemaError('The key "arrayLengths" must be an array');
            }
            if (!this.type.startsWith('array')) {
                throw new IllegalSchemaError(
                    'The key "arrayLength" can only be used when the type is \'array\''
                );
            }
            if (field.arrayLengths.length === 0) {
                throw new IllegalSchemaError('The key "arrayLengths" must have at least one element in the array');
            }
            for (const element of field.arrayLengths) {
                if (typeof element !== "number") {
                    throw new IllegalSchemaError('The values of the key "arrayLengths" must be numbers');
                }
                if (element < 1) {
                    throw new IllegalSchemaError('The values of the key "arrayLengths" must be greater than 0');
                }
            }
            return field.arrayLengths as number[];
        }
        return undefined;
    }

    private isArrayOf(baseType : string) : boolean {
        return this.type.startsWith("array") && this.type.includes(baseType);
    }
}