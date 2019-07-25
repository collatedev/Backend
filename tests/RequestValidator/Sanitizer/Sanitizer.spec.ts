import IValidationSchema from "../../../src/RequestValidator/ValidationSchema/IValidationSchema";
import ValidationSchema from "../../../src/RequestValidator/ValidationSchema/ValidationSchema";
import IValidationResult from "../../../src/RequestValidator/ValidationResult/IValidationResult";
import ITypeConfiguration from "../../../src/RequestValidator/ValidationSchema/ITypeConfiguration";
import TypeConfiguration from "../../../src/RequestValidator/ValidationSchema/TypeConfiguration";
import ISanitizer from "../../../src/RequestValidator/Sanitizer/ISanitizer";
import PathBuilder from "../../../src/RequestValidator/PathBuilder/PathBuilder";
import Sanitizer from "../../../src/RequestValidator/Sanitizer/Sanitizer";

const EmptyValidationSchema : IValidationSchema = new ValidationSchema({
    types: {
        
    }
});

test("Sanitizes a string with valid length", () => {
    const sanitizer : ISanitizer = new Sanitizer(new PathBuilder(), EmptyValidationSchema);
    
    const configuration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "string",
            required: true,
            length: 1
        }
    });

    assertValidResult(sanitizer.sanitize({
        foo: "A"
    }, configuration));
});

test("Sanitizes a string with invalid length", () => {
    const sanitizer : ISanitizer = new Sanitizer(new PathBuilder(), EmptyValidationSchema);
    const configuration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "string",
            required: true,
            length: 0
        }
    });

    assertResultHasError(
        sanitizer.sanitize({
            foo: "A"
        }, configuration), "foo", "Length of 'foo' is 1 when it should be 0"
    );
});

test("Sanitizes a string that does not start with foo", () => {
    const sanitizer : ISanitizer = new Sanitizer(new PathBuilder(), EmptyValidationSchema);
    const configuration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "string",
            required: true,
            startsWith: "foo"
        }
    });

    assertResultHasError(
        sanitizer.sanitize({
            foo: "A"
        }, configuration), "foo", "Value 'A' does not start with 'foo'"
    );
});

test("Sanitizes a string that does start with foo", () => {
    const sanitizer : ISanitizer = new Sanitizer(new PathBuilder(), EmptyValidationSchema);
    const configuration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "string",
            required: true,
            startsWith: "foo"
        }
    });

    assertValidResult(sanitizer.sanitize({
        foo: "foo"
    }, configuration));
});

test("Sanitizes a string that is not a url", () => {
    const sanitizer : ISanitizer = new Sanitizer(new PathBuilder(), EmptyValidationSchema);
    const configuration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "string",
            required: true,
            isURL: true
        }
    });

    assertResultHasError(sanitizer.sanitize({
        foo: "A"
    }, configuration), "foo", "Value 'A' is not a valid URL");
});

test("Sanitizes a string that is a url", () => {
    const sanitizer : ISanitizer = new Sanitizer(new PathBuilder(), EmptyValidationSchema);
    const configuration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "string",
            required: true,
            isURL: true
        }
    });

    assertValidResult(sanitizer.sanitize({
        foo : "http://res.cloudinary.com/hrscywv4p/image/upload/c_fill," +
        "g_faces:center,h_128,w_128/yflwk7vffgwyyenftkr7.png"
    }, configuration));
});

test("Sanitizes a number with outside of the range", () => {
    const sanitizer : ISanitizer = new Sanitizer(new PathBuilder(), EmptyValidationSchema);
    const value : number = 2;
    const configuration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "number",
            required: true,
            range: [0, 1]
        }
    });

    assertResultHasError(
        sanitizer.sanitize({
            foo: value
        }, configuration), 
        "foo", 
        "Value '2' is outside of the range [0, 1]"
    );
});

test("Sanitizes a number within the range", () => {
    const sanitizer : ISanitizer = new Sanitizer(new PathBuilder(), EmptyValidationSchema);
    const configuration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "number",
            required: true,
            range: [0, 1]
        }
    });

    assertValidResult(sanitizer.sanitize({
        foo: 1
    }, configuration));
});

test("Sanitizes an enum with with an unknown enum value", () => {
    const sanitizer : ISanitizer = new Sanitizer(new PathBuilder(), EmptyValidationSchema);
    const configuration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "enum",
            required: true,
            values: ["foo", "bar"]
        }
    });

    assertResultHasError(
        sanitizer.sanitize({
            foo: "A"
        }, configuration),
        "foo", 
        "Illegal enum value 'A', acceptable values are 'foo, bar'"
    );
});

test("Sanitizes an enum with with an known enum value", () => {
    const sanitizer : ISanitizer = new Sanitizer(new PathBuilder(), EmptyValidationSchema);
    const configuration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "enum",
            required: true,
            values: ["A", "B"]
        }
    });

    assertValidResult(sanitizer.sanitize({
        foo: "A"
    }, configuration));
});

test("Sanitizes an array with an incorrect length", () => {
    const sanitizer : ISanitizer = new Sanitizer(new PathBuilder(), EmptyValidationSchema);
    const configuration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "array[string]",
            required: true,
            arrayLengths: [1]
        }
    });

    assertResultHasError(
        sanitizer.sanitize({
            foo: ["foo", "bar"]
        }, configuration), 
        "foo", 
        "Array length of 'foo' is 2 when it should be 1"
    );
});

test("Sanitizes a nested array with an incorrect length", () => {
    const nestedLength : number = 6;
    const baseLength : number = 2;
    const sanitizer : ISanitizer = new Sanitizer(new PathBuilder(), EmptyValidationSchema);
    const configuration : ITypeConfiguration = new TypeConfiguration({
        foo : {
            type: "array[array[array[string]]]",
            required: true,
            arrayLengths: [baseLength, nestedLength, 1]
        }
    });

    assertResultHasError(
        sanitizer.sanitize({
            foo: [
                [["0"],["1"],["2"],["3"],["4"], ["5"]],
                [["0"],["1"],["2"],["3"],["4"], []],
            ]
        }, configuration), 
        "foo[1][5]", 
        "Array length of 'foo[1][5]' is 0 when it should be 1"
    );
});

test("Sanitizes a nested array with an incorrect nested object", () => {
    const sanitizer : ISanitizer = new Sanitizer(new PathBuilder(), new ValidationSchema({
        types: {
            Foo: {
                bar: {
                    type: "string",
                    required: true,
                    startsWith: "qux"
                }
            }
        }
    }));
    const configuration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "array[array[Foo]]",
            required: true
        }
    });

    assertResultHasError(
        sanitizer.sanitize({
            foo: [[
                {
                    bar: "baz",
                }
            ]]
        }, configuration), 
        "foo[0][0].bar", 
        "Value 'baz' does not start with 'qux'"
    );
});


test("Sanitizes an array with a correct length", () => {
    const sanitizer : ISanitizer = new Sanitizer(new PathBuilder(), EmptyValidationSchema);
    const configuration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "array[string]",
            required: true,
            arrayLengths: [1]
        }
    });

    assertValidResult(sanitizer.sanitize({
        foo: ["bar"]
    }, configuration));
});

test("Sanitizes an array with a string that is not a url", () => {
    const sanitizer : ISanitizer = new Sanitizer(new PathBuilder(), EmptyValidationSchema);
    const configuration : ITypeConfiguration = new TypeConfiguration({
        foo : {
            type: "array[string]",
            required: true,
            isURL: true
        }
    });

    assertResultHasError(
        sanitizer.sanitize({
            foo: ["http://foo.com", "bar"]
        }, configuration),
        "foo[1]",
        "Value 'bar' is not a valid URL"
    );
});

test("Sanitizes an string with a present optional parameter", () => {
    const sanitizer : ISanitizer = new Sanitizer(new PathBuilder(), EmptyValidationSchema);
    const configuration : ITypeConfiguration = new TypeConfiguration({
        foo : {
            type: "string",
            required: false,
            startsWith: "bar"
        }
    });

    assertValidResult(sanitizer.sanitize({
        foo: "bar1"
    }, configuration));
});

test("Sanitizes an string with an incorrect present optional parameter", () => {
    const sanitizer : ISanitizer = new Sanitizer(new PathBuilder(), EmptyValidationSchema);
    const configuration : ITypeConfiguration = new TypeConfiguration({
        foo : {
            type: "string",
            required: false,
            startsWith: "bar"
        }
    });

    assertResultHasError(
        sanitizer.sanitize({
            foo: "baz1"
        }, configuration),
        "foo",
        "Value 'baz1' does not start with 'bar'"
    );
});

test("Sanitizes an string with an absent optional parameter", () => {
    const sanitizer : ISanitizer = new Sanitizer(new PathBuilder(), EmptyValidationSchema);
    const configuration : ITypeConfiguration = new TypeConfiguration({
        foo : {
            type: "string",
            required: false,
            startsWith: "bar"
        }
    });

    assertValidResult(sanitizer.sanitize({}, configuration));
});

test("Sanitizes an invalid nested object", () => {
    const sanitizer : ISanitizer = new Sanitizer(new PathBuilder(), new ValidationSchema({
        types: {
            Foo: {
                bar: {
                    type: "Baz",
                    required: true,
                }
            },
            Baz: {
                qux: {
                    type : "string",
                    required : true,
                    startsWith: "foo"
                }
            }
        }
    }));
    const configuration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "Foo",
            required: true
        }
    });

    assertResultHasError(
        sanitizer.sanitize({
            foo: {
                bar: {
                    qux: "bar42"
                }
            }
        }, configuration), 
        "foo.bar.qux", 
        "Value 'bar42' does not start with 'foo'"
    );
});

test("Sanitizes an valid nested object", () => {
    const sanitizer : ISanitizer = new Sanitizer(new PathBuilder(), new ValidationSchema({
        types: {
            Foo: {
                bar: {
                    type: "Baz",
                    required: true,
                }
            },
            Baz: {
                qux: {
                    type : "string",
                    required : true,
                    startsWith: "foo"
                }
            }
        }
    }));
    const configuration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "Foo",
            required: true
        }
    });

    assertValidResult(sanitizer.sanitize({
            foo: {
                bar: {
                    qux: "foo42"
                }
            }
    }, configuration));
});

test("Sanitizes an invalid complexly nested object", () => {
    const sanitizer : ISanitizer = new Sanitizer(new PathBuilder(), new ValidationSchema({
        types: {
            Foo: {
                bar: {
                    type: "Baz",
                    required: true,
                }
            },
            Baz: {
                qux: {
                    type : "string",
                    required : true,
                    startsWith: "foo"
                }
            }
        }
    }));
    const configuration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "array[array[Foo]]",
            required: true
        }
    });

    assertResultHasError(
        sanitizer.sanitize({
            foo: [[
                {
                    bar: {
                        qux: "bar42"
                    },
                }
            ]]
        }, configuration), 
        "foo[0][0].bar.qux", 
        "Value 'bar42' does not start with 'foo'"
    );
});

test("Sanitizes a valid complexly nested object", () => {
    const sanitizer : ISanitizer = new Sanitizer(new PathBuilder(), new ValidationSchema({
        types: {
            Foo: {
                bar: {
                    type: "Baz",
                    required: true,
                }
            },
            Baz: {
                qux: {
                    type : "string",
                    required : true,
                    startsWith: "foo"
                }
            }
        }
    }));
    const configuration : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "array[array[Foo]]",
            required: true
        }
    });

    assertValidResult(sanitizer.sanitize({
        foo: [[
            {
                bar: {
                    qux: "foo42"
                },
            }
        ]]  
    }, configuration));
});

function assertValidResult(result : IValidationResult) : void {
    expect(result.isValid()).toBeTruthy();
    expect(result.errors()).toHaveLength(0);
}

function assertResultHasError(result : IValidationResult, location: string, message : string) : void {
    expect(result.isValid()).toBeFalsy();
    expect(result.errors()).toHaveLength(1);
    expect(result.errors()[0].location).toEqual(location);
    expect(result.errors()[0].message).toEqual(message);
}