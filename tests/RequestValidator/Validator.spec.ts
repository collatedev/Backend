import ValidatorTestSchemas from '../models/ValidatorTestSchemas.json';
import IValidator from '../../src/RequestValidator/IValidator';
import Validator from '../../src/RequestValidator/Validator';
import RequestBuilder from '../../src/RequestValidator/Request/RequestBuilder';
import IRequestBuilder from '../../src/RequestValidator/Request/IRequestBuilder';
import IRequest from '../../src/RequestValidator/Request/IRequest';
import IValidationResult from '../../src/RequestValidator/ValidationResult/IValidationResult';
import ValidationSchema from '../../src/RequestValidator/ValidationSchema/ValidationSchema';
import IValidationSchema from '../../src/RequestValidator/ValidationSchema/IValidationSchema';

test('Validates empty body', () => {
    const schemaIndex : number = 0;
    const validator : IValidator = new Validator();
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder.build();

    assertValidResult(validator.validate(request, getValidator(schemaIndex)));
});

test('Validates request with schema', () => {
    const schemaIndex : number = 15;
    const validator : IValidator = new Validator();
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder.build();

    assertResultHasError(
        validator.validate(request, getValidator(schemaIndex)), 
        "", 
        "Unknown type 'request'"
    );
});


test('Validates empty body', () => {
    const schemaIndex : number = 0;
    const validator : IValidator = new Validator();
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder.build();

    assertValidResult(validator.validate(request, getValidator(schemaIndex)));
});

test('Validates a body that is a number', () => {
    const schemaIndex : number = 14;
    const validator : IValidator = new Validator();
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder.setBody(1).build();

    assertValidResult(validator.validate(request, getValidator(schemaIndex)));
});

test('Validates a body that is a wrong type', () => {
    const schemaIndex : number = 14;
    const validator : IValidator = new Validator();
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder.setBody(true).build();

    assertResultHasError(
        validator.validate(request, getValidator(schemaIndex)), 
        "body", 
        "Property 'body' should be type 'number'"
    );
});


test('Validates a request with incorrect custom type', () => {
    const schemaIndex : number = 8;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    foo: 1
                                })
                                .build();

    assertResultHasError(
        validator.validate(request, getValidator(schemaIndex)), 
        "body.foo", 
        "Property 'foo' should be type 'bar'"
    );
});

test('Validates a request with incorrect nested custom type', () => {
    const schemaIndex : number = 8;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    foo: {
                                        baz: "a"
                                    }
                                })
                                .build();

    assertResultHasError(
        validator.validate(request, getValidator(schemaIndex)), 
        "body.foo.baz", 
        "Property 'baz' should be type 'number'"
    );
});

test('Validates a request with correct nested custom type', () => {
    const schemaIndex : number = 8;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    foo: {
                                        baz: 1
                                    }
                                })
                                .build();

    assertValidResult(validator.validate(request, getValidator(schemaIndex)));
});

test('Validates a request body', () => {
    const schemaIndex : number = 1;
    const validator : IValidator = new Validator();

    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({ foo : 1 })
                                .build();

    assertValidResult(validator.validate(request, getValidator(schemaIndex)));
});

test('Validates a request body with a missing property', () => {
    const schemaIndex : number = 2;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({})
                                .build();

    assertResultHasError(
        validator.validate(request, getValidator(schemaIndex)), 
        "body", 
        "Missing property 'foo'"
    );
});

test('Validates a request body with an optional property', () => {
    const schemaIndex : number = 3;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({})
                                .build();

    assertValidResult(validator.validate(request, getValidator(schemaIndex)));
});

test('Validates a request body with extra properties', () => {
    const schemaIndex : number = 13;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
									foo: 1,
                                    bar: "baz"
                                })
                                .build();

    assertResultHasError(
        validator.validate(request, getValidator(schemaIndex)), 
        "body", 
        "Unexpected property 'bar'"
    );
});

test('Validates a request with incorrect number type', () => {
    const schemaIndex : number = 1;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    foo: true
                                })
                                .build();

    assertResultHasError(
        validator.validate(request, getValidator(schemaIndex)), 
        "body.foo", 
        "Property 'foo' should be type 'number'"
    );
});

test('Validates a request with incorrect string type', () => {
    const schemaIndex : number = 4;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: true
                                })
                                .build();

    assertResultHasError(
        validator.validate(request, getValidator(schemaIndex)), 
        "body.bar", 
        "Property 'bar' should be type 'string'"
    );
});

test('Validates a request with incorrect boolean type', () => {
    const schemaIndex : number = 5;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: 1
                                })
                                .build();

    assertResultHasError(
        validator.validate(request, getValidator(schemaIndex)), 
        "body.bar", 
        "Property 'bar' should be type 'boolean'"
    );
});

test('Validates a request with incorrect enum type', () => {
    const schemaIndex : number = 6;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: 1
                                })
                                .build();

    const result : IValidationResult = validator.validate(request, getValidator(schemaIndex));

    const numberOfErrors : number = 2;
    expect(result.errors().length).toEqual(numberOfErrors);
    assertResultHasErrorAtIndex(
        result,
        "body.bar", 
        "Property 'bar' should be type 'enum'",
        0
    );
    assertResultHasErrorAtIndex(
        result,
        "body.bar", 
        "Illegal enum value '1', acceptable values are 'A, B'",
        1
    );
});

test('Validates a request with correct enum type', () => {
    const schemaIndex : number = 6;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: "A"
                                })
                                .build();

    assertValidResult(validator.validate(request, getValidator(schemaIndex)));
});

test('Validates a request with incorrect array type', () => {
    const schemaIndex : number = 7;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: 1
                                })
                                .build();

    assertResultHasError(
        validator.validate(request, getValidator(schemaIndex)), 
        "body.bar", 
        "Property 'bar' should be type 'array[string]'"
    );
});

test('Validates a request with an empty array', () => {
    const schemaIndex : number = 7;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: []
                                })
                                .build();

    assertValidResult(
        validator.validate(request, getValidator(schemaIndex)), 
    );
});

test('Validates a request with an array that has incorrect element types', () => {
    const schemaIndex : number = 7;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: [1]
                                })
                                .build();

    assertResultHasError(
        validator.validate(request, getValidator(schemaIndex)), 
        "body.bar[0]", 
        "Property 'bar[0]' should be type 'string'"
    );
});

test('Validates a request with a nested array that has an incorrect structure', () => {
    const schemaIndex : number = 9;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: [1]
                                })
                                .build();

    assertResultHasError(
        validator.validate(request, getValidator(schemaIndex)), 
        "body.bar[0]", 
        "Property 'bar[0]' should be type 'array'"
    );
});

test('Validates a request with an array that has nested arrays', () => {
    const schemaIndex : number = 9;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: [[1]]
                                })
                                .build();

    assertResultHasError(
        validator.validate(request, getValidator(schemaIndex)), 
        "body.bar[0][0]", 
        "Property 'bar[0][0]' should be type 'string'"
    );
});

test('Validates a request with an array that has nested arrays', () => {
    const schemaIndex : number = 9;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: [["A", "B"]]
                                })
                                .build();

    assertValidResult(validator.validate(request, getValidator(schemaIndex)));
});

test('Validates a request with an array that has nested arrays of enums', () => {
    const schemaIndex : number = 10;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: [["A", "B"]]
                                })
                                .build();

    assertValidResult(validator.validate(request, getValidator(schemaIndex)));
});

test('Validates a request with nested arrays expecting a nested type', () => {
    const schemaIndex : number = 11;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: [[false]]
                                })
                                .build();

    assertResultHasError(
        validator.validate(request, getValidator(schemaIndex)), 
        "body.bar[0][0]", 
        "Property 'bar[0][0]' should be type 'foo'"
    );
});

test('Validates a request with with nested arrays and finds an error on the baz property', () => {
    const schemaIndex : number = 11;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: [[{
                                        baz: false
                                    }]]
                                })
                                .build();

    assertResultHasError(
        validator.validate(request, getValidator(schemaIndex)), 
        "body.bar[0][0].baz", 
        "Property 'baz' should be type 'number'"
    );
});

test('Validates a request with with nested arrays of nested types', () => {
    const schemaIndex : number = 11;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: [[{
                                        baz: 1
                                    }]]
                                })
                                .build();

    assertValidResult(validator.validate(request, getValidator(schemaIndex)));
});

test('Validates a request with with nested arrays and finds an error on the quux property', () => {
    const schemaIndex : number = 12;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: [[{
                                        baz: false
                                    }]]
                                })
                                .build();

    assertResultHasError(
        validator.validate(request, getValidator(schemaIndex)), 
        "body.bar[0][0].baz", 
        "Property 'baz' should be type 'qux'"
    );
});

test('Validates a request with with nested arrays and finds an error on the quux property', () => {
    const schemaIndex : number = 12;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: [[{
                                        baz: {
                                            quux: false
                                        }
                                    }]]
                                })
                                .build();

    assertResultHasError(
        validator.validate(request, getValidator(schemaIndex)), 
        "body.bar[0][0].baz.quux", 
        "Property 'quux' should be type 'number'"
    );
});

test('Validates a request with with nested arrays of nested types', () => {
    const schemaIndex : number = 12;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: [[{
                                        baz: {
                                            quux: 1
                                        }
                                    }]]
                                })
                                .build();

    assertValidResult(validator.validate(request, getValidator(schemaIndex)));
});


test('Validates a request with an array that has a correct array', () => {
    const schemaIndex : number = 7;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: ["A"]
                                })
                                .build();

    assertValidResult(validator.validate(request, getValidator(schemaIndex)));
});

test('Validates a request with an incorrect enum value', () => {
    const schemaIndex : number = 6;
    const validator : IValidator = new Validator();
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: "C"
                                })
                                .build();

    assertResultHasError(
        validator.validate(request, getValidator(schemaIndex)), 
        "body.bar", 
        "Illegal enum value 'C', acceptable values are 'A, B'"
    );
});

function getValidator(schemaIndex : number) : IValidationSchema {
    return new ValidationSchema(ValidatorTestSchemas.schemas[schemaIndex]);
}

function assertValidResult(result : IValidationResult) : void {
    expect(result.isValid()).toBeTruthy();
    expect(result.errors()).toHaveLength(0);
}

function assertResultHasError(result : IValidationResult, location: string, message : string) : void {
    expect(result.isValid()).toBeFalsy();
    expect(result.errors()).toHaveLength(1);
    assertResultHasErrorAtIndex(result, location, message, 0);
}

function assertResultHasErrorAtIndex(
    result : IValidationResult, location: string, message : string, index : number
) : void {
    expect(result.isValid()).toBeFalsy();
    expect(result.errors()[index].location).toEqual(location);
    expect(result.errors()[index].message).toEqual(message);
}