export default interface IFieldConfiguration {
    required: boolean;
    type: string;
    values?: string[];
    range?: number[];
    isURL?: boolean;
    startsWith?: string;
    length?: number;
    arrayLengths?: number[];
    isInt? : boolean | undefined;
}