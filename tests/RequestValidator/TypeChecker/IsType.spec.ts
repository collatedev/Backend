import IsType from "../../../src/RequestValidator/Types/IsType";

test("Is a primative value", () => {
    expect(IsType.isPrimative("number")).toEqual(true);
});

test("Is an array value", () => {
    expect(IsType.isArray("array[number]")).toEqual(true);
});

test("Is an enum", () => {
    expect(IsType.isEnum("enum")).toBeTruthy();
});

test("Is type of boolean", () => {
    expect(IsType.isTypeOf('boolean', true)).toBeTruthy();
});

test("Is nested object", () => {
    expect(IsType.isNestedObject({})).toBeTruthy();
});

test("Is not nested object", () => {
    expect(IsType.isNestedObject([])).toBeFalsy();
});

test("Is any type", () => {
    expect(IsType.isAnyType("any")).toBeTruthy();
});