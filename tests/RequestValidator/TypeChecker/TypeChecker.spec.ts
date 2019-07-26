import IValidationSchema from "../../../src/RequestValidator/ValidationSchema/IValidationSchema";
import ValidationSchema from "../../../src/RequestValidator/ValidationSchema/ValidationSchema";
import ITypeChecker from "../../../src/RequestValidator/Types/ITypeChecker";
import TypeChecker from "../../../src/RequestValidator/Types/TypeChecker";
import PathBuilder from "../../../src/RequestValidator/PathBuilder/PathBuilder";
import ITypeConfiguration from "../../../src/RequestValidator/ValidationSchema/ITypeConfiguration";
import TypeConfiguration from "../../../src/RequestValidator/ValidationSchema/TypeConfiguration";
import IValidationResult from "../../../src/RequestValidator/ValidationResult/IValidationResult";

const EmptySchema : IValidationSchema = new ValidationSchema({
    types: {}
});

test("That the value is a string", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "string",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: "string"
    }, typeConfiguration);

    expectValidResult(validationResult);
});

test("That the type is not a string", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "string",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: true
    }, typeConfiguration);

    expectInvalidResult(
        validationResult,
        "foo",
        "Property 'foo' should be type 'string'"
    );
});

test("That the optional value is a string", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "string",
            required: false
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: "string"
    }, typeConfiguration);

    expectValidResult(validationResult);
});

test("That the optional value is not a string", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "string",
            required: false
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: 1
    }, typeConfiguration);

    expectInvalidResult(
        validationResult,
        "foo",
        "Property 'foo' should be type 'string'"
    );
});

test("That the optional value is missing", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "string",
            required: false
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({}, typeConfiguration);

    expectValidResult(validationResult);
});

test("That the value is a boolean", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "boolean",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: true
    }, typeConfiguration);

    expectValidResult(validationResult);
});

test("That the value is a boolean", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "boolean",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: "True"
    }, typeConfiguration);

    expectValidResult(validationResult);
});

test("That the value is a boolean", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "boolean",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: "faLse"
    }, typeConfiguration);

    expectValidResult(validationResult);
});

test("That the type is not a boolean", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "boolean",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: 1
    }, typeConfiguration);

    expectInvalidResult(
        validationResult,
        "foo",
        "Property 'foo' should be type 'boolean'"
    );
});

test("That the value is a number", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "number",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: "1"
    }, typeConfiguration);

    expectValidResult(validationResult);
});

test("That the value is a number", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "number",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: 1
    }, typeConfiguration);

    expectValidResult(validationResult);
});

test("That the type is not a number", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "number",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: true
    }, typeConfiguration);

    expectInvalidResult(
        validationResult,
        "foo",
        "Property 'foo' should be type 'number'"
    );
});

test("That the value is a enum", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "enum",
            required: true,
            values: ["A"]
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: "A"
    }, typeConfiguration);

    expectValidResult(validationResult);
});


test("That the type is not an enum", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "enum",
            required: true,
            values: ["A"]
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: true
    }, typeConfiguration);

    expectInvalidResult(
        validationResult,
        "foo",
        "Property 'foo' should be type 'enum'"
    );
});

test("That the value is a nested object", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), new ValidationSchema({
        types: {
            bar: {
                baz: {
                    type: "string",
                    required: true
                }
            }
        }
    }));

    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "bar",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: {
            baz: "string"
        }
    }, typeConfiguration);

    expectValidResult(validationResult);
});


test("That the type is not a nested object", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), new ValidationSchema({
        types: {
            bar: {
                baz: {
                    type: "string",
                    required: true
                }
            }
        }
    }));

    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "bar",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: 1
    }, typeConfiguration);

    expectInvalidResult(
        validationResult,
        "foo",
        "Property 'foo' should be type 'bar'"
    );
});

test("That the value is a nested object with a nested object", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), new ValidationSchema({
        types: {
            bar: {
                baz: {
                    type: "qux",
                    required: true
                }
            },
            qux: {
            }
        }
    }));

    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "bar",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: {
            baz: {}
        }
    }, typeConfiguration);

    expectValidResult(validationResult);
});


test("That the type is not a nested object with a nested object", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), new ValidationSchema({
        types: {
            bar: {
                baz: {
                    type: "qux",
                    required: true
                }
            },
            qux: {
            }
        }
    }));

    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "bar",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: {
            baz: 1
        }
    }, typeConfiguration);

    expectInvalidResult(
        validationResult,
        "foo.baz",
        "Property 'baz' should be type 'qux'"
    );
});

test("That the type is an array", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "array[string]",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: []
    }, typeConfiguration);

    expectValidResult(validationResult);
});


test("That the type is not an array", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "array[string]",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: "string"
    }, typeConfiguration);

    expectInvalidResult(validationResult, "foo", "Property 'foo' should be type 'array[string]'");
});

test("That the element types of the array are strings", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "array[string]",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: ["string"]
    }, typeConfiguration);

    expectValidResult(validationResult);
});

test("That the element types of the array are not strings", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "array[string]",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: [1]
    }, typeConfiguration);

    expectInvalidResult(validationResult, "foo[0]", "Property 'foo[0]' should be type 'string'");
});

test("That the element types of the array are booleans", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "array[boolean]",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: [true]
    }, typeConfiguration);

    expectValidResult(validationResult);
});

test("That the element types of the array are not booleans", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "array[boolean]",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: ["string"]
    }, typeConfiguration);

    expectInvalidResult(validationResult, "foo[0]", "Property 'foo[0]' should be type 'boolean'");
});

test("That the element types of the array are numbers", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "array[number]",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: [1]
    }, typeConfiguration);

    expectValidResult(validationResult);
});

test("That the element types of the array are not numbers", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "array[number]",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: ["string"]
    }, typeConfiguration);

    expectInvalidResult(validationResult, "foo[0]", "Property 'foo[0]' should be type 'number'");
});

test("That the element types of the array are enums", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "array[enum]",
        required: true,
        values: ["A"]
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: ["A"]
    }, typeConfiguration);

    expectValidResult(validationResult);
});

test("That the element types of the array are not enums", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "array[enum]",
            required: true,
            values: ["A"]
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: [1]
    }, typeConfiguration);

    expectInvalidResult(validationResult, "foo[0]", "Property 'foo[0]' should be type 'enum'");
});

test("That the element types of the array are nested objects", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), new ValidationSchema({
        types: {
            bar: {
            }
        }
    }));
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "array[bar]",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: [{}]
    }, typeConfiguration);

    expectValidResult(validationResult);
});

test("That the element types of the array are not nested objects", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), new ValidationSchema({
        types: {
            bar: {
            }
        }
    }));
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "array[bar]",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: [1]
    }, typeConfiguration);

    expectInvalidResult(validationResult, "foo[0]", "Property 'foo[0]' should be type 'bar'");
});

test("That the nested object fields of an array have correct types", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), new ValidationSchema({
        types: {
            bar: {
                baz: {
                    type: "string",
                    required: true
                }
            }
        }
    }));

    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "array[bar]",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: [{
            baz: "string"
        }]
    }, typeConfiguration);

    expectValidResult(validationResult);
});

test("That the nested object fields of an array do not have correct types", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), new ValidationSchema({
        types: {
            bar: {
                baz: {
                    type: "string",
                    required: true
                }
            }
        }
    }));

    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "array[bar]",
            required: true
        }
    });

    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: [{
            baz: 1
        }]
    }, typeConfiguration);

    expectInvalidResult(validationResult, "foo[0].baz", "Property 'baz' should be type 'string'");
});

test("That the nested arrays do not have correct element types", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "array[array[string]]",
            required: true
        }
    });
    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: [
            ["1", "1"],
            ["1", 0]
        ]
    }, typeConfiguration);

    expectInvalidResult(validationResult, "foo[1][1]", "Property 'foo[1][1]' should be type 'string'");
});

test("That the complexly nested objects have correct types", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), new ValidationSchema({
        types: {
            bar: {
                baz: {
                    type: "qux",
                    required: true
                }
            },
            qux: {
                qax: {
                    type: "string",
                    required: true
                }
            }
        }
    }));
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "array[array[bar]]",
            required: true
        }
    });
    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: [[{
            baz: {
                qax: "string"
            }
        }]]
    }, typeConfiguration);

    expectValidResult(validationResult);
});

test("That the complexly nested objects do not have correct types", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), new ValidationSchema({
        types: {
            bar: {
                baz: {
                    type: "qux",
                    required: true
                }
            },
            qux: {
                qax: {
                    type: "string",
                    required: true
                }
            }
        }
    }));
    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "array[array[bar]]",
            required: true
        }
    });
    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: [[{
            baz: {
                qax: 1
            }
        }]]
    }, typeConfiguration);

    expectInvalidResult(validationResult, "foo[0][0].baz.qax", "Property 'qax' should be type 'string'");
});

test("That the value is any type", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "any",
            required: true
        }
    });
    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: [
            ["1", "1"],
            () : boolean => true
        ]
    }, typeConfiguration);

    expectValidResult(validationResult);
});

test("That the value is an array of any typed elements", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const typeConfiguration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "array[any]",
            required: true
        }
    });
    const validationResult : IValidationResult = typeChecker.typeCheck({
        foo: [
            ["1", "1"],
            true
        ]
    }, typeConfiguration);

    expectValidResult(validationResult);
});

function expectValidResult(validationResult : IValidationResult) : void {
    expect(validationResult.isValid()).toBeTruthy();
    expect(validationResult.errors().length).toEqual(0);
}

function expectInvalidResult(validationResult : IValidationResult, location : string, message : string) : void {
    expect(validationResult.isValid()).toBeFalsy();
    expect(validationResult.errors().length).toEqual(1);
    expect(validationResult.errors()[0].location).toEqual(location);
    expect(validationResult.errors()[0].message).toEqual(message);
}