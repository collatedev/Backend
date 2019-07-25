import IllegalSchemaError from "../../../src/RequestValidator/ValidationSchema/IllegalSchemaError";
import ITypeConfiguration from "../../../src/RequestValidator/ValidationSchema/ITypeConfiguration";
import TypeConfiguration from "../../../src/RequestValidator/ValidationSchema/TypeConfiguration";
import IFieldConfiguration from "../../../src/RequestValidator/ValidationSchema/IFieldConfiguration";

test('Throws an error creating an illegal type from null json', () => {
    expect(createType(null)).toThrow(IllegalSchemaError);
});

test('Throws an error creating a type configuration due to illegal json', () => {
    expect(createType(1)).toThrow(IllegalSchemaError);
});

test('Should throw an error due to getting a field that does not exist on the type', () => {
    const type : ITypeConfiguration = new TypeConfiguration({});

    expect(() : void => {
        type.getConfiguration("foo");
    }).toThrow(IllegalSchemaError);
});

test('Creates an empty type', () => {
    const type : ITypeConfiguration = new TypeConfiguration({});

    expect(type.getFields()).toHaveLength(0);
});

test('Creates a type with a field', () => {
    const json : any = {
        foo: {
            required: true,
            type: "string"
        }
    };

    const type : ITypeConfiguration = new TypeConfiguration(json);
    const fooField : IFieldConfiguration = type.getConfiguration("foo");

    expect(type.getFields()).toHaveLength(1);
    expect(type.hasField("foo")).toBeTruthy();
    expect(fooField).not.toBeNull();
    expect(fooField.required).toBeTruthy();
    expect(fooField.type).toEqual("string");
});

function createType(json : any) : () => ITypeConfiguration {
    return (() : ITypeConfiguration => {
        return new TypeConfiguration(json);
    });
}