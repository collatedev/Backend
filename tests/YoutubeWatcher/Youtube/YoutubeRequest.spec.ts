import IYoutubeRequest from "../../../src/YoutubeWatcher/Youtube/IYoutubeRequest";
import MockYoutubeRequest from "../../mocks/MockYoutubeRequest";
import FetchRequestBuilder from "../../../src/HTTPRequestBuilder/FetchRequestBuilder";
import StatusCodes from "../../../src/Router/StatusCodes";
import { Response } from "node-fetch";

jest.mock('../../../src/HTTPRequestBuilder/FetchRequestBuilder');

describe("send", () => {
    test("It should send a request to the correct url", async () => {
        FetchRequestBuilder.prototype.makeRequest = jest.fn().mockReturnValueOnce(Promise.resolve(new Response("", {
            status: 200
        })));
        const request : IYoutubeRequest = new MockYoutubeRequest();

        const response : Response = await request.send();

        expectYoutubeApiCall('test');
        expect(response.status).toEqual(StatusCodes.OK);
    });

    test("It should fail to send a request", async () => {
        FetchRequestBuilder.prototype.makeRequest = jest.fn().mockImplementation(() => {
            return Promise.reject(new Error('request failed'));
        });
        const request : IYoutubeRequest = new MockYoutubeRequest();

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