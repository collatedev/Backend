import IErrorHandler from "../../../src/RequestValidator/ErrorHandler/IErrorHandler";
import ValidatorErrorHandler from "../../../src/RequestValidator/ErrorHandler/ValidatorErrorHandler";
import PathBuilder from "../../../src/RequestValidator/PathBuilder/PathBuilder";
import ErrorType from "../../../src/RequestValidator/ErrorHandler/ErrorType";
import IValidationError from "../../../src/RequestValidator/ValidationResult/IValidationError";
import IPathBuilder from "../../../src/RequestValidator/PathBuilder/IPathBuilder";
import PropertyPathComponent from "../../../src/RequestValidator/PathBuilder/PropertyPathComponent";
import IndexPathComponent from "../../../src/RequestValidator/PathBuilder/IndexPathComponent";

test("Checks that there are no errors on the handler", () => {
    const errorHandler : IErrorHandler = new ValidatorErrorHandler(new PathBuilder());

    expect(errorHandler.getErrors()).toHaveLength(0);
    expect(errorHandler.hasErrors()).toBeFalsy();
});

test("Adds a root error to the error handler", () => {
    const errorHandler : IErrorHandler = new ValidatorErrorHandler(new PathBuilder());

    errorHandler.handleError(["foo"], ErrorType.UnknownType);

    const errors : IValidationError[] = errorHandler.getErrors();

    expect(errors).toHaveLength(1);
    expect(errors[0].location).toEqual("");
    expect(errors[0].message).toEqual("Unknown type 'foo'");
    expect(errorHandler.hasErrors()).toBeTruthy();
});

test("Adds a missing property error to the error handler", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();
    pathBuilder.addPathComponent(new PropertyPathComponent("foo"));
    const errorHandler : IErrorHandler = new ValidatorErrorHandler(pathBuilder);

    errorHandler.handleError(["bar"], ErrorType.MissingField);

    const errors : IValidationError[] = errorHandler.getErrors();

    expect(errors).toHaveLength(1);
    expect(errors[0].location).toEqual("foo");
    expect(errors[0].message).toEqual("Missing property 'bar'");
    expect(errorHandler.hasErrors()).toBeTruthy();
});

test("Adds a unexpected property error to the error handler", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();
    pathBuilder.addPathComponent(new PropertyPathComponent("foo"));
    const errorHandler : IErrorHandler = new ValidatorErrorHandler(pathBuilder);

    errorHandler.handleError(["bar"], ErrorType.UnexpectedField);

    const errors : IValidationError[] = errorHandler.getErrors();

    expect(errors).toHaveLength(1);
    expect(errors[0].location).toEqual("foo");
    expect(errors[0].message).toEqual("Unexpected property 'bar'");
    expect(errorHandler.hasErrors()).toBeTruthy();
});

test("Adds a type error to the error handler", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();
    pathBuilder.addPathComponent(new PropertyPathComponent("foo"));
    pathBuilder.addPathComponent(new PropertyPathComponent("bar"));
    const errorHandler : IErrorHandler = new ValidatorErrorHandler(pathBuilder);

    errorHandler.handleError(["bar", "string"], ErrorType.IncorrectType);

    const errors : IValidationError[] = errorHandler.getErrors();

    expect(errors).toHaveLength(1);
    expect(errors[0].location).toEqual("foo.bar");
    expect(errors[0].message).toEqual("Property 'bar' should be type 'string'");
    expect(errorHandler.hasErrors()).toBeTruthy();
});

test("Adds a type error to the error handler at an index", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();
    pathBuilder.addPathComponent(new PropertyPathComponent("foo"));
    pathBuilder.addPathComponent(new PropertyPathComponent("bar"));
    pathBuilder.addPathComponent(new IndexPathComponent(1));
    const errorHandler : IErrorHandler = new ValidatorErrorHandler(pathBuilder);

    errorHandler.handleError(["bar", "string"], ErrorType.IncorrectType);

    const errors : IValidationError[] = errorHandler.getErrors();

    expect(errors).toHaveLength(1);
    expect(errors[0].location).toEqual("foo.bar[1]");
    expect(errors[0].message).toEqual("Property 'bar[1]' should be type 'string'");
    expect(errorHandler.hasErrors()).toBeTruthy();
});

test("Joins two validation errors together", () => {
    const errorHandlerA : IErrorHandler = new ValidatorErrorHandler(new PathBuilder());
    const errorHandlerB : IErrorHandler = new ValidatorErrorHandler(new PathBuilder());

    errorHandlerB.handleError(["bar", "string"], ErrorType.IncorrectType);

    errorHandlerA.join(errorHandlerB);

    const errors : IValidationError[] = errorHandlerA.getErrors();

    expect(errors).toHaveLength(1);
    expect(errors[0].location).toEqual("");
    expect(errors[0].message).toEqual("Property 'bar' should be type 'string'");
    expect(errorHandlerA.hasErrors()).toBeTruthy();
})

test("Throws an expection when handling an unkown error type", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();
    const errorHandler : IErrorHandler = new ValidatorErrorHandler(pathBuilder);

    expect(() => {
        errorHandler.handleError([], ErrorType.Unknown);
    }).toThrow(TypeError);
});