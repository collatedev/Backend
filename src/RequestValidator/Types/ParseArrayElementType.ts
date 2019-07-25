export default class ParseArrayElementType {
    /* Parses the elemnt type of an array type
     * Assumption
     *  Array type string will be of the form array[array[...]]
     *  Otherwise return an empty array
     * Examples:
     *  Consider "array[string]"
     *  Returns "[string]"
     * 
     *  Consider "array[array[enum]]"
     *  Returns "[array, enum]"
     */ 

    public static parse(arrayType : string) : string[] {
        if (!arrayType.startsWith("array")) {
            return [];
        }

        const elementTypes : string[] = [];
        while (arrayType.includes("array[")) {
            arrayType = arrayType.replace("array[", "");
            elementTypes.push("array");
        }
        elementTypes.pop();
        // gets the last type of the array as it is contained within two brakcets
        // Example: [string] returns : string
        elementTypes.push(arrayType.substring(0, arrayType.indexOf("]")));
        return elementTypes;
    }
}