import ParseArrayElementType from "../../../src/RequestValidator/Types/ParseArrayElementType";

test("Returns empty array when parsing non-array type", () => {
    expect(ParseArrayElementType.parse("foo")).toHaveLength(0);
});

test("Parses a basic array", () => {
    const elementTypes : string[] = ParseArrayElementType.parse("array[string]");

    expect(elementTypes.length).toEqual(1);
    expect(elementTypes[0]).toEqual("string");
});

test("Parses a 2D array", () => {
    const elementTypesSize : number = 2;
    const elementTypes : string[] = ParseArrayElementType.parse("array[array[string]]");

    expect(elementTypes.length).toEqual(elementTypesSize);
    expect(elementTypes[0]).toEqual("array");
    expect(elementTypes[1]).toEqual("string");
});