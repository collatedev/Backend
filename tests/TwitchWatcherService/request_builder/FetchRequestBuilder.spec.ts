import FetchRequestBuilder from "../../../src/TwitchWatcher/request_builder/FetchRequestBuilder";

test("Should make a request", (done : any) => {
	const requestBuilder : FetchRequestBuilder = new FetchRequestBuilder();
	
	requestBuilder.makeRequest("http://localhost:1", {
		method: "GET"
	}).catch((error : any) => {
		expect(error).not.toBeNull();
		done();
	});
});