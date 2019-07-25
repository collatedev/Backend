import IRequestMapping from "../../../src/RequestValidator/Request/IRequestMapping";
import RequestMapping from "../../../src/RequestValidator/Request/RequestMapping";
import IRequest from "../../../src/RequestValidator/Request/IRequest";
import Request from "../../../src/RequestValidator/Request/Request";

const EmptyMapping : IRequestMapping = new RequestMapping({});
const TestMapping : IRequestMapping = new RequestMapping({
    foo: "bar"
});

test('Creates an empty request', () => {
    testRequest(EmptyMapping, EmptyMapping, EmptyMapping, EmptyMapping, EmptyMapping);
});

test('Creates a request with a body', () => {
    testRequest(TestMapping, EmptyMapping, EmptyMapping, EmptyMapping, EmptyMapping);
});

test('Creates a request with cookies', () => {
    testRequest(EmptyMapping, TestMapping, EmptyMapping, EmptyMapping, EmptyMapping);
});

test('Creates a request with headers', () => {
    testRequest(EmptyMapping, EmptyMapping, TestMapping, EmptyMapping, EmptyMapping);
});

test('Creates a request with params', () => {
    testRequest(EmptyMapping, EmptyMapping, EmptyMapping, TestMapping, EmptyMapping);
});

test('Creates a request with query', () => {
    testRequest(EmptyMapping, EmptyMapping, EmptyMapping, EmptyMapping, TestMapping);
});

test('Creates a request as json', () => {
    const request : IRequest = new Request({}, {}, {}, {}, {});

    expect(request.toJson()).toEqual({
        body: {},
        cookies: {},
        headers : {},
        params: {},
        query: {},
    });
});

function testRequest(
    body : IRequestMapping, 
    cookies : IRequestMapping,
    headers : IRequestMapping, 
    params : IRequestMapping, 
    query : IRequestMapping
) : void {
	const request : IRequest = new Request(body, cookies, headers, params, query);
	const mapping : IRequestMapping = new RequestMapping({
		body,
		cookies,
		headers,
		params,
		query
	});

    expect(request.getRequest()).toEqual(mapping);
}
