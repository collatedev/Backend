import ITypeChecker from "./ITypeChecker";
import IFieldConfiguration from "../ValidationSchema/IFieldConfiguration";
import IValidationResult from "../ValidationResult/IValidationResult";
import IValidationSchema from "../ValidationSchema/IValidationSchema";
import IPathBuilder from "../PathBuilder/IPathBuilder";
import IsType from "./IsType";
import ValidationResult from "../ValidationResult/ValidationResult";
import ValidatorErrorHandler from "../ErrorHandler/ValidatorErrorHandler";
import ErrorType from "../ErrorHandler/ErrorType";
import ArrayType from "../ValidationSchema/ArrayElementConfiguration";
import IndexPathComponent from "../PathBuilder/IndexPathComponent";
import PropertyPathComponent from "../PathBuilder/PropertyPathComponent";
import ITypeConfiguration from "../ValidationSchema/ITypeConfiguration";
import INestedArray from "../NestedArray/INestedArray";
import IPathComponent from "../PathBuilder/IPathComponent";
import NestedArray from "../NestedArray/NestedArray";
import ParseArrayElementType from "./ParseArrayElementType";

export default class TypeChecker implements ITypeChecker {
    private readonly schema : IValidationSchema;
    private readonly pathBuilder : IPathBuilder;

    private validationResult : IValidationResult;
    private errorHandler : ValidatorErrorHandler;

    constructor(pathBuilder : IPathBuilder, schema : IValidationSchema) {
        this.schema = schema;
        this.pathBuilder = pathBuilder;
        this.errorHandler = new ValidatorErrorHandler(pathBuilder);
        this.validationResult = new ValidationResult(this.errorHandler);
    }

    public typeCheck(value : any, configuration : ITypeConfiguration) : IValidationResult {
        this.errorHandler = new ValidatorErrorHandler(this.pathBuilder);
        this.validationResult = new ValidationResult(this.errorHandler);

        this.typeCheckType(value, configuration);

        return this.validationResult;
    }

    private typeCheckType(value : any, configuration : ITypeConfiguration) : void {
        for (const field of configuration.getFields()) {
            if (this.valueHasProperty(value, field)) {
                this.pathBuilder.addPathComponent(new PropertyPathComponent(field));
                this.typeCheckField(field, value[field], configuration.getConfiguration(field));
                this.pathBuilder.popComponent();
            }
        }
    }

    private valueHasProperty(value : any, field : string) : boolean {
        return Object.keys(value).includes(field);
    }

    private typeCheckField(fieldName : string, value : any, configuration : IFieldConfiguration) : void {
        if (IsType.isAnyType(configuration.type)) {
            return;
        } else if (IsType.isPrimative(configuration.type)) {
            this.typeCheckPrimative(fieldName, value, configuration);
        } else if (IsType.isEnum(configuration.type) && !IsType.isTypeOf("string", value)) {
            this.errorHandler.handleError([fieldName, configuration.type], ErrorType.IncorrectType);
        }  else if (IsType.isArray(configuration.type)) {
            this.typeCheckArray(fieldName, value, configuration);
        } else if (this.schema.hasType(configuration.type)) {
            this.typeCheckNestedObject(fieldName, value, configuration);
        } else if (this.isUnknownType(configuration.type)) {
            this.errorHandler.handleError([fieldName, configuration.type], ErrorType.IncorrectType);
        }
    }

    private typeCheckPrimative(fieldName : string, value : any, configuration : IFieldConfiguration) : void {
        switch (configuration.type) {
            case "string":
                if (!IsType.isTypeOf(configuration.type, value)) {
                    this.errorHandler.handleError([fieldName, configuration.type], ErrorType.IncorrectType);
                }
                break;
            case "boolean":
                if (!IsType.isTypeOf(configuration.type, value) && !this.isBooleanString(value)) {
                    this.errorHandler.handleError([fieldName, configuration.type], ErrorType.IncorrectType);
                }
                break;
            case "number":
                if (!IsType.isTypeOf(configuration.type, value) && !this.isNumberString(value)) {
                    this.errorHandler.handleError([fieldName, configuration.type], ErrorType.IncorrectType);
                }
                break;
        }
    }

    private isBooleanString(value : any) : boolean {
        return IsType.isTypeOf("string", value) && (
            (value as string).toLowerCase() === "true" ||
            (value as string).toLowerCase() === "false"
        );
    }

    private isNumberString(value : any) : boolean {
        return IsType.isTypeOf("string", value) && !isNaN(parseInt(value, 10));
    }

    private typeCheckNestedObject(fieldName : string, value : any, configuration : IFieldConfiguration) : void {
        const typeConfiguration : ITypeConfiguration = this.schema.getTypeConfiguration(configuration.type);
        if (IsType.isNestedObject(value)) {
            this.typeCheckType(value, typeConfiguration);
        } else {
            this.errorHandler.handleError([fieldName, configuration.type], ErrorType.IncorrectType);
        }
    }

    private isUnknownType(type : string) : boolean {
        return !IsType.isPrimative(type) &&
                    !IsType.isEnum(type) &&
                    !IsType.isArray(type) &&
                    !IsType.isAnyType(type) && 
                    !this.schema.hasType(type);
    }

    private typeCheckArray(fieldName : string, value : any, configuration : IFieldConfiguration) : void {
        if (!Array.isArray(value)) {
            this.errorHandler.handleError([fieldName, configuration.type], ErrorType.IncorrectType);
        } else {
            const nestedArrayStack : INestedArray[] = [new NestedArray(value, 0, this.pathBuilder)];

            while (nestedArrayStack.length > 0) {
                const nestedArray : INestedArray = nestedArrayStack.pop() as INestedArray;
                const array : any[] = nestedArray.value();
                const arrayPath : IPathComponent[] = nestedArray.path().getCurrentIndexComponents();
                this.pathBuilder.addPathComponents(arrayPath);

                this.enqueNestedArrays(array, nestedArrayStack, nestedArray);
                this.typeCheckArrayElement(fieldName, nestedArray, configuration);

                this.pathBuilder.popComponents(arrayPath.length);
            }
        }
    }

    private enqueNestedArrays(array : any[], nestedArrayStack : INestedArray[], nestedArray : INestedArray) : void {
        for (let i : number = 0; i < array.length; i++) {
            const nestedValue : any = array[i];
            if (Array.isArray(nestedValue)) {
                this.pathBuilder.addPathComponent(new IndexPathComponent(i));
                nestedArrayStack.push(
                    new NestedArray(
                        nestedValue, 
                        nestedArray.depth() + 1, 
                        this.pathBuilder
                    )
                );
                this.pathBuilder.popComponent();
            }
        }
    }

    private typeCheckArrayElement(
        fieldName : string, nestedArray : INestedArray, arrayConfiguration : IFieldConfiguration
    ) : void {
        const elementConfiguration : IFieldConfiguration = ArrayType.getElementType(arrayConfiguration);
        const arrayStructure : string[] = ParseArrayElementType.parse(arrayConfiguration.type);
        // add an array to the structure because the parser makes the assumption that
        // the first array should be removed. Adding this array allows us to use the
        // structure of the array to check whether or not the type of the nested array
        // is correct by indexing the structure through the depth of the nested array
        arrayStructure.unshift("array"); 

        const array : any[] = nestedArray.value();

        for (let i : number = 0; i < array.length; i++) {
            const element : any = array[i];    
            if (!Array.isArray(element)) {
                this.pathBuilder.addPathComponent(new IndexPathComponent(i));

                if (this.isExpectedTypeAtDepth(arrayStructure, nestedArray, element)) {
                    this.errorHandler.handleError([fieldName, "array"], ErrorType.IncorrectType);
                } else if (this.schema.hasType(elementConfiguration.type)) {
                    this.typeCheckNestedObject(fieldName, element, elementConfiguration);                    
                } else {
                    this.typeCheckField(fieldName, element, elementConfiguration);
                }

                this.pathBuilder.popComponent();
            }
        }
    }

    private isExpectedTypeAtDepth(arrayStructure : string[], nestedArray : INestedArray, element : any) : boolean {
        if (nestedArray.depth() + 1 >= arrayStructure.length) {
            return false;
        } else {
            return arrayStructure[nestedArray.depth() + 1] === "array" && !Array.isArray(element);
        }   
    }
}