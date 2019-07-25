import IFieldConfiguration from "./IFieldConfiguration";
import ParseArrayElementType from "../Types/ParseArrayElementType";
import FieldConfiguration from "./FieldConfiguration";

export default class ArrayElementConfiguration implements IFieldConfiguration {
    public readonly required: boolean;
    public readonly type: string;
    public readonly values?: string[] | undefined;
    public readonly range?: number[] | undefined;
    public readonly isURL?: boolean | undefined;
    public readonly startsWith?: string | undefined;
    public readonly length?: number | undefined;
    public readonly arrayLengths?: number[] | undefined;

    constructor() {
        this.required = false;
        this.type = "";
    }

    // TODO :
    // convert this static function to the constructor

    public static getElementType(configuration : IFieldConfiguration) : IFieldConfiguration {
        // gets the element type of the array
        const elementType : string = ParseArrayElementType.parse(configuration.type).pop() as string;
        const fieldJSON : any = {
            type : elementType,
            required : true
        };
        if (configuration.isURL !== undefined) {
            fieldJSON.isURL = configuration.isURL;
        }
        if (configuration.length !== undefined) {
            fieldJSON.length = configuration.length;
        }
        if (configuration.range !== undefined) {
            fieldJSON.range = configuration.range;
        }
        if (configuration.startsWith !== undefined) {
            fieldJSON.startsWith = configuration.startsWith;
        }
        if (configuration.values !== undefined) {
            fieldJSON.values = configuration.values;
        }
        return new FieldConfiguration(fieldJSON);
    }
}