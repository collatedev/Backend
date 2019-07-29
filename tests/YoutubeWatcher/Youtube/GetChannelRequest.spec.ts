import IYoutubeRequest from "../../../src/YoutubeWatcher/Youtube/IYoutubeRequest";
import FetchRequestBuilder from "../../../src/HTTPRequestBuilder/FetchRequestBuilder";
import StatusCodes from "../../../src/Router/StatusCodes";
import { Response } from "node-fetch";
import GetChannelRequest from "../../../src/YoutubeWatcher/Youtube/GetChannelRequest";

jest.mock('../../../src/HTTPRequestBuilder/FetchRequestBuilder');

describe("send", () => {
    const OLD_ENV : any = process.env;

	beforeEach(() => {
		jest.resetModules(); // this is important - it clears the cache
		process.env = { ...OLD_ENV };
		delete process.env.NODE_ENV;
	});

	afterEach(() => {
		process.env = OLD_ENV;
    });
    
    test("It should send a request to the correct url", async () => {
        process.env.YOUTUBE_API_KEY = "api_key";
        FetchRequestBuilder.prototype.makeRequest = jest.fn().mockReturnValueOnce(Promise.resolve(new Response("", {
            status: 200
        })));
        const request : IYoutubeRequest = new GetChannelRequest("foo");

        const response : Response = await request.send();

        expectYoutubeApiCall('channels?part=snippet%2CcontentDetails%2Cstatistics&forUsername=foo&key=api_key');
        expect(response.status).toEqual(StatusCodes.OK);
    });

    test("It should fail to send a request", async () => {
        FetchRequestBuilder.prototype.makeRequest = jest.fn().mockImplementation(() => {
            return Promise.reject(new Error('request failed'));
        });
        const request : IYoutubeRequest = new GetChannelRequest("foo");

        await expect(request.send()).rejects.toThrow(new Error('request failed'));
    });
});

function expectYoutubeApiCall(uri : string) : void {
    expect(FetchRequestBuilder.prototype.makeRequest).toHaveBeenCalledWith(
        `https://www.googleapis.com/youtube/v3/${uri}`,
        {
            method: "GET",
        }
    );
}