import ISanitizer from "./ISanitizer";
import IValidationResult from "../ValidationResult/IValidationResult";
import ValidationResult from "../ValidationResult/ValidationResult";
import IErrorHandler from "../ErrorHandler/IErrorHandler";
import IPathBuilder from "../PathBuilder/IPathBuilder";
import SanitizerErrorHandler from "../ErrorHandler/SanitizerErrorHandler";
import IFieldConfiguration from "../ValidationSchema/IFieldConfiguration";
import ErrorType from "../ErrorHandler/ErrorType";
import IndexPathComponent from "../PathBuilder/IndexPathComponent";
import INestedArray from "../NestedArray/INestedArray";
import NestedArray from "../NestedArray/NestedArray";
import ArrayType from "../ValidationSchema/ArrayElementConfiguration";
import URLChecker from "./URLChecker";
import IValidationSchema from "../ValidationSchema/IValidationSchema";
import IsType from "../Types/IsType";
import ParseArrayElementType from "../Types/ParseArrayElementType";
import ITypeConfiguration from "../ValidationSchema/ITypeConfiguration";
import PropertyPathComponent from "../PathBuilder/PropertyPathComponent";
import IPathComponent from "../PathBuilder/IPathComponent";

export default class Sanitizer implements ISanitizer {
    private result : IValidationResult;
    private errorHandler : IErrorHandler;
    private fieldName : string;

    private readonly pathBuilder : IPathBuilder;
    private readonly schema : IValidationSchema;

    constructor(pathBuilder : IPathBuilder, schema : IValidationSchema) {
        this.pathBuilder = pathBuilder;
        this.errorHandler = new SanitizerErrorHandler(this.pathBuilder);
        this.result = new ValidationResult(this.errorHandler);
        this.schema = schema;
        this.fieldName = "";
    }

    public sanitize(value : any, configuration : ITypeConfiguration) : IValidationResult {
        this.errorHandler = new SanitizerErrorHandler(this.pathBuilder);
        this.result = new ValidationResult(this.errorHandler);

        this.sanitizeType(value, configuration);

        return this.result;
    }

    private sanitizeType(value : any, configuration : ITypeConfiguration) : void {
        for (const fieldName of configuration.getFields()) {
            this.fieldName = fieldName;

            if (this.valueHasProperty(value, fieldName)) {
                this.pathBuilder.addPathComponent(new PropertyPathComponent(fieldName));
                this.sanitizeValue(value[fieldName], configuration.getConfiguration(fieldName));
                this.pathBuilder.popComponent();
            }
        }
    }

    private valueHasProperty(value : any, field : string) : boolean {
        return Object.keys(value).includes(field);
    }

    private sanitizeValue(value : any, configuration : IFieldConfiguration) : void {
        if (configuration.type === "string") {
            this.sanitizeString(value, configuration);
        }
        if (configuration.type === "number") {
            this.sanitizeNumber(value, configuration);
        }
        if (configuration.type === "enum") {
            this.sanitizeEnum(value, configuration);
        }
        if (configuration.type.startsWith("array") && Array.isArray(value)) {
            this.sanitizeArray(value, configuration);
        }
        if (this.schema.hasType(configuration.type) && IsType.isNestedObject(value)) {
            this.sanitizeType(value, this.schema.getTypeConfiguration(configuration.type));
        }
    }

    private sanitizeString(value : any, configuration : IFieldConfiguration) : void {
        if (this.isIllegalLength(value, configuration)) {
            this.errorHandler.handleError(
                [this.fieldName, value.length, configuration.length], 
                ErrorType.IllegalLengthError
            );
        }
        if (this.doesNotStartWith(value, configuration)) {
            this.errorHandler.handleError([value, configuration.startsWith], ErrorType.DoesNotStartWithError);
        }
        if (URLChecker.isURL(value, configuration)) {
            this.errorHandler.handleError([value], ErrorType.IllegalURLError);
        }
    }

    private isIllegalLength(value : any, configuration : IFieldConfiguration) : boolean {
        return configuration.length !== undefined && value.length !== configuration.length;
    }

    private doesNotStartWith(value : any, configuration : IFieldConfiguration) : boolean {
        return configuration.startsWith !== undefined && !value.startsWith(configuration.startsWith);
    }

    private sanitizeNumber(value : any, configuration : IFieldConfiguration) : void {
        if (this.isNotInt(value, configuration)) {
            this.errorHandler.handleError(
                [value], 
                ErrorType.NonIntValueError
            );
        }
        if (this.isOutOfRange(value, configuration)) {
            // this joins the array as a string of the form "x, y". We know range is not undefined due to
            // the isOutOfRangeMethod
            const rangeString : string = (configuration.range as number[]).join(", ");
            this.errorHandler.handleError(
                [value, rangeString], 
                ErrorType.OutOfRangeError
            );
        }
    }

    private isNotInt(value : any, configuration : IFieldConfiguration) : boolean {
        return configuration.isInt !== undefined &&
            !Number.isInteger(value);
    }

    private isOutOfRange(value : any, configuration : IFieldConfiguration) : boolean {
        return configuration.range !== undefined && 
            (configuration.range[0] > value || configuration.range[1] < value);
    }

    private sanitizeEnum(value : any, configuration : IFieldConfiguration) : void {
        if (this.isIllegalEnumValue(value, configuration)) {
            // this joins the array as a string of the form "EnumA, EnumB". We know values is not undefined due to
            // the isIllegalEnumValue method
            const enumString : string = (configuration.values as string[]).join(", ");
            this.errorHandler.handleError(
                [value, enumString], 
                ErrorType.IllegalEnumValue
            );
        }
    }

    private isIllegalEnumValue(value : any, configuration : IFieldConfiguration) : boolean {
        return configuration.values !== undefined && !configuration.values.includes(value);
    }

    private sanitizeArray(value : any, configuration : IFieldConfiguration) : void {
        const nestedArrayStack : INestedArray[] = [new NestedArray(value, 0, this.pathBuilder)];
        const arrayLengths : number[] | undefined = configuration.arrayLengths;

		while (nestedArrayStack.length > 0) {
            const nestedArray : INestedArray = nestedArrayStack.pop() as INestedArray;
            const array : any[] = nestedArray.value();
            const arrayPath : IPathComponent[] = nestedArray.path().getCurrentIndexComponents();
            this.pathBuilder.addPathComponents(arrayPath);

            if (arrayLengths) {
                this.checkLengthOfArray(arrayLengths, nestedArray);
            }

            this.enqueNestedArrays(array, nestedArrayStack, nestedArray);
            this.sanitizeNestedArrayElements(nestedArray, configuration);
            this.pathBuilder.popComponents(arrayPath.length);
		}
    }

    private checkLengthOfArray(arrayLengths : number[], nestedArray : INestedArray) : void {
        const expectedLength : number = arrayLengths[nestedArray.depth()];
        if (nestedArray.value().length !== expectedLength) {
            this.errorHandler.handleError(
                [this.pathBuilder.getPath(), nestedArray.value().length, expectedLength],
                ErrorType.IllegalArrayLength
            );
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

    private sanitizeNestedArrayElements(nestedArray : INestedArray, configuration : IFieldConfiguration) : void {
        const array : any[] = nestedArray.value();

        for (let i : number = 0; i < array.length; i++) {
            const element : any = array[i];
            if (!Array.isArray(element)) {
                this.sanitizeArrayElement(element, i, configuration);
            }
        }
    }

    private sanitizeArrayElement(element : any, index : number, configuration : IFieldConfiguration) : void {
        this.pathBuilder.addPathComponent(new IndexPathComponent(index));

        if (IsType.isTypeOf("object", element)) {
            const arrayTypes : string[] = ParseArrayElementType.parse(configuration.type);
            const elementName : string = arrayTypes[arrayTypes.length - 1];
            const elementConfiguration : ITypeConfiguration = this.schema.getTypeConfiguration(elementName);

            this.sanitizeType(element, elementConfiguration);
        } else {
            const elementConfiguration : IFieldConfiguration = ArrayType.getElementType(configuration);
            this.sanitizeValue(element, elementConfiguration);
        }
        
        this.pathBuilder.popComponent();
    }
}
