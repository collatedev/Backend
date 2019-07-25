import TestSchema from '../../models/TestSchema.json';
import IllegalSchemaError from '../../../src/RequestValidator/ValidationSchema/IllegalSchemaError';
import IValidationSchema from '../../../src/RequestValidator/ValidationSchema/IValidationSchema';
import TypeConfiguration from '../../../src/RequestValidator/ValidationSchema/TypeConfiguration';
import IFieldConfiguration from '../../../src/RequestValidator/ValidationSchema/IFieldConfiguration';
import ITypeConfiguration from '../../../src/RequestValidator/ValidationSchema/ITypeConfiguration';
import ValidationSchema from '../../../src/RequestValidator/ValidationSchema/ValidationSchema';

test('Fails to create a validation schema due to null json', () => {
    expect(createValidationSchema(null)).toThrow(IllegalSchemaError);
});

test('Fails to create a validation schema due to illegal json', () => {
    expect(createValidationSchema(1)).toThrow(IllegalSchemaError);
});

test('Fails to create a validation schema due to empty json', () => {
    expect(createValidationSchema({})).toThrow(IllegalSchemaError);
});

test('Fails to create a validation schema due to illegal type of "types"', () => {
    expect(createValidationSchema({ types: 1 })).toThrow(IllegalSchemaError);
});

test('Fails to create a validation schema due to null "types"', () => {
    expect(createValidationSchema({ types: null })).toThrow(IllegalSchemaError);
});

test('Fails to get a type definition due to undefined type', () => {
    const json : any = {
        types: {
            
        }
    };

    const validationSchema : IValidationSchema = new ValidationSchema(json);

    expect(() => {
        validationSchema.getTypeConfiguration("foo");
    }).toThrow(IllegalSchemaError);
});

test('Gets a simple type definition', () => {
    const json : any = {
        types: {
            foo: {
                bar: {
                    required: true,
                    type: "number"
                }
            }
        }
    };

    const validationSchema : IValidationSchema = new ValidationSchema(json);

    expect(validationSchema.hasType("foo"));
    expect(validationSchema.getTypes()).toEqual(["foo"]);
    expect(validationSchema.getTypeConfiguration("foo")).toEqual(new TypeConfiguration({
        bar: {
            required: true,
            type: "number"
        }
    }));
});

test('Should throw an exception due to getting a type that does not exist', () => {
    const json : any = {
        types: {

        }
    };

    const schema : IValidationSchema = new ValidationSchema(json);

    expect(() : void => {
        schema.getTypeConfiguration("foo");
    }).toThrow(IllegalSchemaError);
});

test('Creates a validation schema', () => {
    const json : any = {
        types: {

        }
    };

    const schema : IValidationSchema = new ValidationSchema(json);

    expect(schema).not.toBeNull();
    expect(schema.getTypes()).toHaveLength(0);
});

test('Creates a validation schema with an empty type', () => {
    const json : any = {
        types: {
            body: {

            }
        }
    };

    const schema : IValidationSchema = new ValidationSchema(json);
    const bodyType : ITypeConfiguration = schema.getTypeConfiguration("body");

    expect(schema).not.toBeNull();
    expect(schema.getTypes()).toHaveLength(1);
    expect(schema.hasType("body")).toBeTruthy();
    expect(bodyType).not.toBeNull();
    expect(bodyType.getFields()).toHaveLength(0);
});

test('Creates a validation schema with a non-empty type', () => {
    const json : any = {
        types: {
            body: {
                foo: {
                    required: true,
                    type: "string"
                }
            }
        }
    };

    const schema : IValidationSchema = new ValidationSchema(json);
    const bodyType : ITypeConfiguration = schema.getTypeConfiguration("body");
    const fooField : IFieldConfiguration = bodyType.getConfiguration("foo");

    expect(schema).not.toBeNull();
    expect(schema.getTypes()).toHaveLength(1);
    expect(schema.hasType("body")).toBeTruthy();
    expect(bodyType).not.toBeNull();
    expect(bodyType.getFields()).toHaveLength(1);
    expect(bodyType.getFields()[0]).toEqual("foo");
    expect(fooField.type).toEqual("string");
    expect(fooField.required).toBeTruthy();
});

test('Fails to create a validation schema due to undefined type', () => {
    const json : any = {
        types: {
            body: {
                foo: {
                    required: true,
                    type: "foo"
                }
            }
        }
    };

    expect(createValidationSchema(json)).toThrow(IllegalSchemaError);
});

test('Fails to create a validation schema due to illegal array definition', () => {
    const json : any = {
        types: {
            body: {
                foo: {
                    required: true,
                    type: "array"
                }
            }
        }
    };
    expect(createValidationSchema(json)).toThrow(IllegalSchemaError);
});

test('Fails to create a validation schema due to illegal array definition', () => {
    const json : any = {
        types: {
            body: {
                foo: {
                    required: true,
                    type: "array[]"
                }
            }
        }
    };
    expect(createValidationSchema(json)).toThrow(IllegalSchemaError);
});

test('Fails to create a validation schema due to illegal array definition', () => {
    const json : any = {
        types: {
            body: {
                foo: {
                    required: true,
                    type: "array[[a]"
                }
            }
        }
    };
    expect(createValidationSchema(json)).toThrow(IllegalSchemaError);
});

test('Fails to create a validation schema due to illegal array definition', () => {
    const json : any = {
        types: {
            body: {
                foo: {
                    required: true,
                    type: "array[a]]"
                }
            }
        }
    };
    expect(createValidationSchema(json)).toThrow(IllegalSchemaError);
});

test('Fails to create a validation schema due to illegal array definition', () => {
    const json : any = {
        types: {
            body: {
                foo: {
                    required: true,
                    type: "array[[a]]"
                }
            }
        }
    };
    expect(createValidationSchema(json)).toThrow(IllegalSchemaError);
});

test('Fails to create a validation schema due to illegal array definition', () => {
    const json : any = {
        types: {
            body: {
                foo: {
                    required: true,
                    type: "array[array[string]a]"
                }
            }
        }
    };
    expect(createValidationSchema(json)).toThrow(IllegalSchemaError);
});

test('Fails to create a validation schema due to illegal array definition', () => {
    const json : any = {
        types: {
            body: {
                foo: {
                    required: true,
                    type: "array[array[array[string]a]"
                }
            }
        }
    };
    expect(createValidationSchema(json)).toThrow(IllegalSchemaError);
});

test('Creates validation schema with nested array', () => {
    const json : any = {
        types: {
            body: {
                foo: {
                    required: true,
                    type: "array[array[string]]"
                }
            }
        }
    };
    
    const schema : IValidationSchema = new ValidationSchema(json);
    const bodyType : ITypeConfiguration = schema.getTypeConfiguration("body");
    const fieldType : IFieldConfiguration = bodyType.getConfiguration("foo");

    expect(fieldType.type).toEqual("array[array[string]]");
    expect(fieldType.required).toBeTruthy();
});

test('Should create a schema from the TestSchema json file', () => {
    const schema : IValidationSchema = new ValidationSchema(TestSchema);
    const MaxLeaseSeconds : number = 864000;
    const BodySize : number = 7;
    const SecretLength : number = 16;

    const bodyType : ITypeConfiguration = schema.getTypeConfiguration("body");
    const hubModeField : IFieldConfiguration = bodyType.getConfiguration("hub.mode");
    const hubLeaseSecondsField : IFieldConfiguration = bodyType.getConfiguration("hub.lease_seconds");
    const hubCallbackField : IFieldConfiguration = bodyType.getConfiguration("hub.callback");
    const hubTopicField : IFieldConfiguration = bodyType.getConfiguration("hub.topic");
    const hubSecretField : IFieldConfiguration = bodyType.getConfiguration("hub.secret");
    const fooField : IFieldConfiguration = bodyType.getConfiguration("foo");
    const quxField : IFieldConfiguration = bodyType.getConfiguration("qux");

    const barType : ITypeConfiguration = schema.getTypeConfiguration("bar");
    const bazField : IFieldConfiguration = barType.getConfiguration("baz");

    expect(bodyType.getFields()).toHaveLength(BodySize);
    expect(bodyType.hasField("hub.mode")).toBeTruthy();
    expect(bodyType.hasField("hub.lease_seconds")).toBeTruthy();
    expect(bodyType.hasField("hub.callback")).toBeTruthy();
    expect(bodyType.hasField("hub.topic")).toBeTruthy();
    expect(bodyType.hasField("hub.secret")).toBeTruthy();
    expect(bodyType.hasField("foo")).toBeTruthy();
    expect(bodyType.hasField("qux")).toBeTruthy();

    expect(hubModeField.type).toEqual("enum");
    expect(hubModeField.values).toEqual([
        "subscribe", 
        "unsubscribe"
    ]);
    expect(hubModeField.required).toBeTruthy();
    expect(hubLeaseSecondsField.type).toEqual("number");
    expect(hubLeaseSecondsField.required).toBeTruthy();
    expect(hubLeaseSecondsField.range).toEqual([0, MaxLeaseSeconds]);
    expect(hubCallbackField.type).toEqual("string");
    expect(hubCallbackField.required).toBeTruthy();
    expect(hubCallbackField.isURL).toBeTruthy();
    expect(hubTopicField.type).toEqual("string");
    expect(hubTopicField.required).toBeTruthy();
    expect(hubTopicField.isURL).toBeTruthy();
    expect(hubTopicField.startsWith).toEqual("https://api.twitch.tv/helix/");
    expect(hubSecretField.type).toEqual("string");
    expect(hubSecretField.length).toEqual(SecretLength);
    expect(hubSecretField.required).toBeTruthy();
    expect(fooField.type).toEqual("bar");
    expect(fooField.required).toBeTruthy();
    expect(quxField.type).toEqual("array[string]");
    expect(quxField.required).toBeTruthy();

    expect(barType.getFields()).toHaveLength(1);
    expect(barType.hasField("baz")).toBeTruthy();

    expect(bazField.type).toEqual("number");
    expect(bazField.required).toBeFalsy();
});

function createValidationSchema(json : any) : () => IValidationSchema {
    return (() : IValidationSchema => {
        return new ValidationSchema(json);
    });
}

