import IllegalSchemaError from "../../../src/RequestValidator/ValidationSchema/IllegalSchemaError";
import IFieldConfiguration from "../../../src/RequestValidator/ValidationSchema/IFieldConfiguration";
import FieldConfiguration from "../../../src/RequestValidator/ValidationSchema/FieldConfiguration";

const RangeLength : number = 2;

test('It should fail to create a field configuration due to null json', () => {
    expect(createField(null)).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to illegal json', () => {
    expect(createField(1)).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to being empty json', () => {
    expect(createField({})).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to missing the type field in json', () => {
    expect(createField({
        required: true
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to missing the required field in json', () => {
    expect(createField({
        type: "string"
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to inncorrect type of "type" key in json', () => {
    expect(createField({
        type: 1,
        required: true
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to inncorrect type of "type" key in json', () => {
    expect(createField({
        type: "string",
        required: 1
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to unknown fields being defined in the json', () => {
    expect(createField({
        type: "string",
        required: true,
        foo: "bar"
    })).toThrow(IllegalSchemaError);
});

test('It should create a field configuration', () => {
    const json : any = {
        type: "boolean",
        required: false
    };

    const configuration : IFieldConfiguration = new FieldConfiguration(json);

    expect(configuration.required).toBeFalsy();
    expect(configuration.type).toEqual("boolean");
});

test('It should fail to create a field configuration due to the type not being a number', () => {
    expect(createField({
        type: "string",
        required: true,
        range: 1
    })).toThrow(
        new IllegalSchemaError('The key "range" can only be used when the type is \'number\' or an array of \'number\'')
    );
});

test('It should fail to create a field configuration due to inncorrect type of "range" key in json', () => {
    expect(createField({
        type: "number",
        required: true,
        range: 1
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to inncorrect length of range array', () => {
    expect(createField({
        type: "number",
        required: true,
        range: []
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to inncorrect type of the first index', () => {
    expect(createField({
        type: "number",
        required: true,
        range: ["1", 1]
    })).toThrow(new IllegalSchemaError('The values in the "range" array must be numbers'));
});

test('It should fail to create a field configuration due to inncorrect type of the second index', () => {
    expect(createField({
        type: "number",
        required: true,
        range: [1, "1"]
    })).toThrow(new IllegalSchemaError('The values in the "range" array must be numbers'));
});

test('It should fail to create a field configuration due to both arguments being numbers', () => {
    expect(createField({
        type: "number",
        required: true,
        range: ["1", "1"]
    })).toThrow(new IllegalSchemaError('The values in the "range" array must be numbers'));
});

test('It should create a field configuration with a range parameter', () => {
    const json : any = {
        type: "number",
        required: false,
        range: [0, 1]
    };

    const configuration : IFieldConfiguration = new FieldConfiguration(json);
 
    if (!configuration.range) {
        throw new Error("Range missing from configuration");
    }

    expect(configuration.required).toBeFalsy();
    expect(configuration.type).toEqual("number");
    expect(configuration.range).toHaveLength(RangeLength);
    expect(configuration.range[0]).toEqual(0);
    expect(configuration.range[1]).toEqual(1);
});

test('It should fail to create a field configuration because values can only be used when the type is an enum', () => {
    expect(createField({
        type: "string",
        required: true,
        values: ["test"]
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to inncorrect type of "values" key in json', () => {
    expect(createField({
        type: "enum",
        required: true,
        values: 1
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to "values" being empty', () => {
    expect(createField({
        type: "enum",
        required: true,
        values: []
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to "values" not consisting of string values', () => {
    expect(createField({
        type: "enum",
        required: true,
        values: ["a", 1, "b"]
    })).toThrow(IllegalSchemaError);
});

test('It should create a field configuration with a value parameter', () => {
    const values : string[] = ["A", "B"];
    const json : any = {
        type: "enum",
        required: false,
        values
    };

    const configuration : IFieldConfiguration = new FieldConfiguration(json);
 
    if (!configuration.values) {
        throw new Error("Values missing from configuration");
    }

    expect(configuration.required).toBeFalsy();
    expect(configuration.type).toEqual("enum");
    expect(configuration.values).toHaveLength(values.length);
    expect(configuration.values[0]).toEqual("A");
    expect(configuration.values[1]).toEqual("B");
});

test('It should fail to create a field configuration becuase isURL has wrong type', () => {
    expect(createField({
        type: "string",
        required: true,
        isURL: 1
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration becuase isURL only works on strings', () => {
    expect(createField({
        type: "enum",
        required: true,
        isURL: true
    })).toThrow(IllegalSchemaError);
});

test('It should create a field configuration with isURL key', () => {
    const json : any = {
        type: "string",
        required: false,
        isURL: true
    };

    const configuration : IFieldConfiguration = new FieldConfiguration(json);

    if (!configuration.isURL) {
        throw new Error("Is URL missing from configuration");
    }

    expect(configuration.required).toBeFalsy();
    expect(configuration.type).toEqual("string");
    expect(configuration.isURL).toBeTruthy();
});

test('It should fail to create a field configuration becuase startsWith has wrong type', () => {
    expect(createField({
        type: "string",
        required: true,
        startsWith: 1
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration becuase startsWith only works on strings', () => {
    expect(createField({
        type: "enum",
        required: true,
        startsWith: "http://"
    })).toThrow(IllegalSchemaError);
});

test('It should create a field configuration with isURL key', () => {
    const json : any = {
        type: "string",
        required: false,
        startsWith: "asdf"
    };

    const configuration : IFieldConfiguration = new FieldConfiguration(json);

    if (!configuration.startsWith) {
        throw new Error("Starts With missing from configuration");
    }

    expect(configuration.required).toBeFalsy();
    expect(configuration.type).toEqual("string");
    expect(configuration.startsWith).toEqual("asdf");
});

test('It should fail to create a field configuration becuase length has wrong type', () => {
    expect(createField({
        type: "string",
        required: true,
        length: true
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration becuase length only works on strings and arrays', () => {
    expect(createField({
        type: "enum",
        required: true,
        length: 1
    })).toThrow(IllegalSchemaError);
});

test('It should create a field configuration with length key for string type', () => {
    const json : any = {
        type: "string",
        required: false,
        length: 1
    };

    const configuration : IFieldConfiguration = new FieldConfiguration(json);

    if (!configuration.length) {
        throw new Error("Length missing from configuration");
    }

    expect(configuration.required).toBeFalsy();
    expect(configuration.type).toEqual("string");
    expect(configuration.length).toEqual(1);
});

test('It should create a field configuration with length key for array type', () => {
    const json : any = {
        type: "array[string]",
        required: false,
        arrayLengths: [1]
    };

    const configuration : IFieldConfiguration = new FieldConfiguration(json);

    if (!configuration.arrayLengths) {
        throw new Error("Length missing from configuration");
    }

    expect(configuration.required).toBeFalsy();
    expect(configuration.type).toEqual("array[string]");
    expect(configuration.arrayLengths).toEqual([1]);
});

test('It should create a field configuration with isURL key for array of string type', () => {
    const json : any = {
        type: "array[string]",
        required: false,
        isURL: true
    };

    const configuration : IFieldConfiguration = new FieldConfiguration(json);

    if (!configuration.isURL) {
        throw new Error("Length missing from configuration");
    }

    expect(configuration.required).toBeFalsy();
    expect(configuration.type).toEqual("array[string]");
    expect(configuration.isURL).toEqual(true);
});

test('It should fail to create a field configuration because the type is enum and its missing the "values" key', () => {
    expect(createField({
        type: "enum",
        required: true,
    })).toThrow(IllegalSchemaError);
});

test('It should create a field configuration as the array is of type enum', () => {
    const json : any = {
        type: "array[enum]",
        required: true,
        values: ["A"]
    };

    const configuration : IFieldConfiguration = new FieldConfiguration(json);

    if (!configuration.values) {
        throw new Error("Length missing from configuration");
    }

    expect(configuration.required).toBeTruthy();
    expect(configuration.type).toEqual("array[enum]");
    expect(configuration.values).toEqual(["A"]);
});

test('It should create a field configuration with arrayLengths key describing the array structure', () => {
    const json : any = {
        type: "array[string]",
        required: false,
        arrayLengths: [ 1 ]
    };

    const configuration : IFieldConfiguration = new FieldConfiguration(json);

    if (!configuration.arrayLengths) {
        throw new Error("Array lengths missing from configuration");
    }

    expect(configuration.required).toBeFalsy();
    expect(configuration.type).toEqual("array[string]");
    expect(configuration.arrayLengths).toEqual([1]);
});

test('It should fail to create a field configuration due to arrayLengths not being an array', () => {
    expect(createField({
        type: "array[number]",
        required: true,
        arrayLengths: 1
    })).toThrow(new IllegalSchemaError('The key "arrayLengths" must be an array'));
});

test('It should fail to create a field configuration due to the type not being an array', () => {
    expect(createField({
        type: "number",
        required: true,
        arrayLengths: [1]
    })).toThrow(new IllegalSchemaError('The key "arrayLength" can only be used when the type is \'array\''));
});

test('It should fail to create a field configuration due to the type not being an array', () => {
    expect(createField({
        type: "array[number]",
        required: true,
        arrayLengths: []
    })).toThrow(new IllegalSchemaError('The key "arrayLengths" must have at least one element in the array'));
});

test('It should fail to create a field configuration due to the elements not being numbers', () => {
    expect(createField({
        type: "array[number]",
        required: true,
        arrayLengths: ["1"]
    })).toThrow(new IllegalSchemaError('The values of the key "arrayLengths" must be numbers'));
});

test('It should fail to create a field configuration due to the elements not being greater than 0', () => {
    expect(createField({
        type: "array[number]",
        required: true,
        arrayLengths: [0]
    })).toThrow(new IllegalSchemaError('The values of the key "arrayLengths" must be greater than 0'));
});

function createField(json : any) : () => IFieldConfiguration {
    return (() : IFieldConfiguration => {
        return new FieldConfiguration(json);
    });
}