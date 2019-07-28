import IYoutubeRequest from "../../../src/YoutubeWatcher/Youtube/IYoutubeRequest";
import MockYoutubeRequest from "../../mocks/MockYoutubeRequest";
import FetchRequestBuilder from "../../../src/TwitchWatcher/RequestBuilder/FetchRequestBuilder";
import IRequestBuilder from "../../../src/TwitchWatcher/RequestBuilder/IRequestBuilder";
import StatusCodes from "../../../src/Router/StatusCodes";
import { Response } from "node-fetch";

jest.mock('../../../src/TwitchWatcher/RequestBuilder/FetchRequestBuilder');

describe("send", () => {
    test("It should send a request to the correct url", async () => {
        FetchRequestBuilder.prototype.makeRequest = jest.fn().mockReturnValue(Promise.resolve(new Response("", {
            status: 200
        })));
        const requestBuilder : IRequestBuilder = new FetchRequestBuilder();
        const request : IYoutubeRequest = new MockYoutubeRequest(requestBuilder);

        const response : Response = await request.send();

        expect(requestBuilder.makeRequest).toBeCalledWith(
            'https://www.googleapis.com/youtube/v3/test',
            {
                method: "GET"
            }
        );
        expect(response.status).toEqual(StatusCodes.OK);
    });

    test("It should fail to send a request", async () => {
        FetchRequestBuilder.prototype.makeRequest = jest.fn().mockImplementation(() => {
            return Promise.reject(new Error('request failed'));
        });
        const requestBuilder : IRequestBuilder = new FetchRequestBuilder();
        const request : IYoutubeRequest = new MockYoutubeRequest(requestBuilder);

        await expect(request.send()).rejects.toThrow(new Error('request failed'));
    });
});