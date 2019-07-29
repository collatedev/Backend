import FetchRequestBuilder from "../../src/HTTPRequestBuilder/FetchRequestBuilder";

test("Should make a request", (done : any) => {
	const requestBuilder : FetchRequestBuilder = new FetchRequestBuilder();
	
	requestBuilder.makeRequest("http://localhost:1", {
		method: "GET"
	}).catch((error : any) => {
		expect(error).not.toBeNull();
		done();
	});
});