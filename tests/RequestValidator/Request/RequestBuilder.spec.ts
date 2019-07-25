import IRequestBuilder from "../../../src/RequestValidator/Request/IRequestBuilder";
import RequestBuilder from "../../../src/RequestValidator/Request/RequestBuilder";
import IRequestMapping from "../../../src/RequestValidator/Request/IRequestMapping";
import RequestMapping from "../../../src/RequestValidator/Request/RequestMapping";
import IRequest from "../../../src/RequestValidator/Request/IRequest";

const TestJSON : any = {
    foo: 1
};

test('creates an empty request', () => {
    const builder : IRequestBuilder = new RequestBuilder();

	const request : IRequest = builder.build();
	
	const expectedRequest : IRequestMapping = new RequestMapping({});

    expect(request.getRequest()).toEqual(expectedRequest);
});

test('creates a full request', () => {
    const builder : IRequestBuilder = new RequestBuilder();

    const request : IRequest = builder.setBody(TestJSON)
                                        .setCookies(TestJSON)
                                        .setHeaders(TestJSON)
                                        .setParams(TestJSON)
                                        .setQuery(TestJSON)
										.build();
										
	const expectedRequest : IRequestMapping = new RequestMapping({
		body: TestJSON,
		cookies: TestJSON,
		headers: TestJSON,
		params: TestJSON,
		query: TestJSON
	});

    expect(request.getRequest()).toEqual(expectedRequest);
});