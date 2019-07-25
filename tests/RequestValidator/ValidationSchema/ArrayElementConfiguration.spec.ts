import ArrayElementConfiguration from "../../../src/RequestValidator/ValidationSchema/ArrayElementConfiguration";
import FieldConfiguration from "../../../src/RequestValidator/ValidationSchema/FieldConfiguration";
import IFieldConfiguration from "../../../src/RequestValidator/ValidationSchema/IFieldConfiguration";

test("Creates an array with string element configuration", () => {
    const configuration : IFieldConfiguration = ArrayElementConfiguration.getElementType(new FieldConfiguration({
        type: "array[string]",
        required: true,
        isURL: false,
        length: 1,
        startsWith: "foo"
    }));

    expect(configuration.type).toEqual("string");
    expect(configuration.required).toEqual(true);
    expect(configuration.isURL).toEqual(false);
    expect(configuration.length).toEqual(1);
    expect(configuration.startsWith).toEqual("foo");
});

test("Creates an array with number element configuration", () => {
    const configuration : IFieldConfiguration = ArrayElementConfiguration.getElementType(new FieldConfiguration({
        type: "array[number]",
        required: true,
        range: [0,1]
    }));

    expect(configuration.type).toEqual("number");
    expect(configuration.required).toEqual(true);
    expect(configuration.range).toEqual([0, 1]);
});

test("Creates an array with enum element configuration", () => {
    const configuration : IFieldConfiguration = ArrayElementConfiguration.getElementType(new FieldConfiguration({
        type: "array[enum]",
        required: true,
        values: ["A", "B"]
    }));

    expect(configuration.type).toEqual("enum");
    expect(configuration.required).toEqual(true);
    expect(configuration.values).toEqual(["A", "B"]);
});