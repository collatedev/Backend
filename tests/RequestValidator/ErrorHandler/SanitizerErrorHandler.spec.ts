import IErrorHandler from "../../../src/RequestValidator/ErrorHandler/IErrorHandler";
import SanitizerErrorHandler from "../../../src/RequestValidator/ErrorHandler/SanitizerErrorHandler";
import PathBuilder from "../../../src/RequestValidator/PathBuilder/PathBuilder";
import ErrorType from "../../../src/RequestValidator/ErrorHandler/ErrorType";

test("Handles a values error", () => {
    const errorHandler : IErrorHandler = new SanitizerErrorHandler(new PathBuilder());

    errorHandler.handleError(["foo", "A, B"], ErrorType.IllegalEnumValue);

    expect(errorHandler.hasErrors()).toBeTruthy();
    expect(errorHandler.getErrors()).toEqual([{
        message: "Illegal enum value 'foo', acceptable values are 'A, B'",
        location: ""
    }]);
});

test("Handles a range error", () => {
    const errorHandler : IErrorHandler = new SanitizerErrorHandler(new PathBuilder());
    const value : number = 2;

    errorHandler.handleError([value, "0, 1"], ErrorType.OutOfRangeError);

    expect(errorHandler.hasErrors()).toBeTruthy();
    expect(errorHandler.getErrors()).toEqual([{
        message: "Value '2' is outside of the range [0, 1]",
        location: ""
    }]);
});

test("Handles a isURL error", () => {
    const errorHandler : IErrorHandler = new SanitizerErrorHandler(new PathBuilder());

    errorHandler.handleError(["foo"], ErrorType.IllegalURLError);

    expect(errorHandler.hasErrors()).toBeTruthy();
    expect(errorHandler.getErrors()).toEqual([{
        message: "Value 'foo' is not a valid URL",
        location: ""
    }]);
});

test("Handles a does not start with error", () => {
    const errorHandler : IErrorHandler = new SanitizerErrorHandler(new PathBuilder());

    errorHandler.handleError(["foo", "bar"], ErrorType.DoesNotStartWithError);

    expect(errorHandler.hasErrors()).toBeTruthy();
    expect(errorHandler.getErrors()).toEqual([{
        message: "Value 'foo' does not start with 'bar'",
        location: ""
    }]);
});

test("Handles an illegal length error", () => {
    const errorHandler : IErrorHandler = new SanitizerErrorHandler(new PathBuilder());

    errorHandler.handleError(["foo", 0, 1], ErrorType.IllegalLengthError);

    expect(errorHandler.hasErrors()).toBeTruthy();
    expect(errorHandler.getErrors()).toEqual([{
        message: "Length of 'foo' is 0 when it should be 1",
        location: ""
    }]);
});

test("Handles an illegal array length error", () => {
    const errorHandler : IErrorHandler = new SanitizerErrorHandler(new PathBuilder());

    errorHandler.handleError(["foo", 0, 1], ErrorType.IllegalArrayLength);

    expect(errorHandler.hasErrors()).toBeTruthy();
    expect(errorHandler.getErrors()).toEqual([{
        message: "Array length of 'foo' is 0 when it should be 1",
        location: ""
    }]);
});

test("Handles a unknown error", () => {
    const errorHandler : IErrorHandler = new SanitizerErrorHandler(new PathBuilder());

    expect(() => {
        errorHandler.handleError([], ErrorType.Unknown);
    }).toThrow(TypeError);
});