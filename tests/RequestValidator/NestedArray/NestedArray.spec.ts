import IPathBuilder from "../../../src/RequestValidator/PathBuilder/IPathBuilder";
import PathBuilder from "../../../src/RequestValidator/PathBuilder/PathBuilder";
import PropertyPathComponent from "../../../src/RequestValidator/PathBuilder/PropertyPathComponent";
import INestedArray from "../../../src/RequestValidator/NestedArray/INestedArray";
import NestedArray from "../../../src/RequestValidator/NestedArray/NestedArray";

test("Creates a nested array", () => {
    const pathBuidler : IPathBuilder = new PathBuilder();
    pathBuidler.addPathComponent(new PropertyPathComponent("foo"));
    const nestedArray : INestedArray = new NestedArray([], 0, pathBuidler);

    expect(nestedArray.depth()).toEqual(0);
    expect(nestedArray.value()).toEqual([]);
    expect(nestedArray.path()).toEqual(pathBuidler);
});

test("Creates a nested array with null array", () => {
    expect(() => {
        getNestedArray(null, 0);
    }).toThrow(new Error("Array value must not be null"));
});

test("Creates a nested array with non array value", () => {
    expect(() => {
        getNestedArray(1, 0);
    }).toThrow(new Error("Value must be an array"));
});

test("Creates a nested array with illegal depth", () => {
    expect(() => {
        getNestedArray([], -1);
    }).toThrow(new Error("Depth can not be less than 0"));
});

function getNestedArray(value : any, depth : number) : NestedArray {
    return new NestedArray(value, depth, new PathBuilder());
}