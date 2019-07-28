import IYoutube from "../../../src/YoutubeWatcher/Youtube/IYoutube";
import Youtube from "../../../src/YoutubeWatcher/Youtube/Youtube";
import IYoutubeChannel from "../../../src/UserService/models/IYoutubeChannel";
import { Response } from "node-fetch";
import IRequestBuilder from "../../../src/TwitchWatcher/RequestBuilder/IRequestBuilder";
import FetchRequestBuilder from "../../../src/TwitchWatcher/RequestBuilder/FetchRequestBuilder";
import YoutubeChannel from "../../../src/UserService/Models/YoutubeChannel";
import FormData from "form-data";

jest.mock("../../../src/TwitchWatcher/RequestBuilder/FetchRequestBuilder");

const OLD_ENV : any = process.env;

beforeEach(() => {
    jest.resetModules(); // this is important - it clears the cache
    process.env = { ...OLD_ENV };
    delete process.env.NODE_ENV;
});

afterEach(() => {
    process.env = OLD_ENV;
});

describe("getChannel", () => {
    test("It gets a channel by name", async () => {
        process.env.YOUTUBE_API_KEY = "api_key";
        FetchRequestBuilder.prototype.makeRequest = jest.fn().mockReturnValue(createYoutubePayload({
            id: "bar"
        }));
        const requestBuilder : IRequestBuilder = new FetchRequestBuilder();
        const youtube : IYoutube = new Youtube(requestBuilder);

        const channel : IYoutubeChannel = await youtube.getChannel("foo");

        expect(requestBuilder.makeRequest).toHaveBeenCalledWith(
            'https://www.googleapis.com/youtube/v3/channels?part=snippet%2' +
                'CcontentDetails%2Cstatistics&forUsername=foo' +
                '&key=api_key',
            {
                method: "GET",
            }
        );
        expect(channel.channelName()).toEqual("foo");
        expect(channel.getID()).toEqual("bar");
    });

    test("It fails to gets a channel by name", async () => {
        process.env.YOUTUBE_API_KEY = "api_key";
        FetchRequestBuilder.prototype.makeRequest = jest.fn().mockReturnValue(createErrorPayload());
        const requestBuilder : IRequestBuilder = new FetchRequestBuilder();
        const youtube : IYoutube = new Youtube(requestBuilder);

        await expect(youtube.getChannel("foo")).rejects.toThrow(new Error('Request failed'));
    });

    test("It gets a channel by id", async () => {
        process.env.YOUTUBE_API_KEY = "api_key";
        FetchRequestBuilder.prototype.makeRequest = jest.fn()
            .mockReturnValueOnce(createYoutubePayload())
            .mockReturnValueOnce(createYoutubePayload({
                id: "bar",
                snippet: {
                    title: "Test Title"
                }
            }));
        const requestBuilder : IRequestBuilder = new FetchRequestBuilder();
        const youtube : IYoutube = new Youtube(requestBuilder);

        const channel : IYoutubeChannel = await youtube.getChannel("foo");

        expectYoutubeApiCall(
            requestBuilder, 
            'channels?part=snippet%2CcontentDetails%2Cstatistics&forUsername=foo&key=api_key'
        );
        expectYoutubeApiCall(requestBuilder, 'channels?part=snippet%2CcontentDetails%2Cstatistics&id=foo&key=api_key');
        expect(channel.channelName()).toEqual("Test Title");
        expect(channel.getID()).toEqual("bar");
    });

    test("It fails to get a channel by id", async () => {
        process.env.YOUTUBE_API_KEY = "api_key";
        FetchRequestBuilder.prototype.makeRequest = jest.fn()
            .mockReturnValueOnce(createYoutubePayload())
            .mockReturnValueOnce(createErrorPayload());
        const requestBuilder : IRequestBuilder = new FetchRequestBuilder();
        const youtube : IYoutube = new Youtube(requestBuilder);

        await expect(youtube.getChannel("foo")).rejects.toThrow(new Error('Request failed'));
    });

    test("It fails to find a channel", async () => {
        process.env.YOUTUBE_API_KEY = "api_key";
        FetchRequestBuilder.prototype.makeRequest = jest.fn()
            .mockReturnValueOnce(createYoutubePayload())
            .mockReturnValueOnce(createYoutubePayload());
        const requestBuilder : IRequestBuilder = new FetchRequestBuilder();
        const youtube : IYoutube = new Youtube(requestBuilder);

        await expect(youtube.getChannel("foo")).rejects.toThrow(
            new Error('Could not find a youtube channel by name or id of "foo"')
        );
    });
});

describe("subscribeToPushNotifications", () => {
    test("It subscribes to a channels push notifications", async () => {
        process.env.NODE_ENV = "test";
        process.env.YOUTUBE_API_KEY = "api_key";
        FetchRequestBuilder.prototype.makeRequest = jest.fn().mockReturnValue(
            Promise.resolve(new Response("", {
                status: 202
            }
        )));
        const requestBuilder : IRequestBuilder = new FetchRequestBuilder();
        const youtube : IYoutube = new Youtube(requestBuilder);
        const channel : IYoutubeChannel = getTestYoutubeChannel();

        await youtube.subscribeToPushNotifications(channel);

        expect(requestBuilder.makeRequest).toHaveBeenCalledWith(
            'https://pubsubhubbub.appspot.com/subscribe',
            expect.objectContaining({
                method: "POST",
                body : expect.any(FormData)
            })
        );
    });

    test("It fails to subscribe to a channels push notifications", async () => {
        process.env.NODE_ENV = "test";
        process.env.YOUTUBE_API_KEY = "api_key";
        FetchRequestBuilder.prototype.makeRequest = jest.fn().mockReturnValue(createErrorPayload());
        const requestBuilder : IRequestBuilder = new FetchRequestBuilder();
        const youtube : IYoutube = new Youtube(requestBuilder);
        const channel : IYoutubeChannel = getTestYoutubeChannel();

        await expect(youtube.subscribeToPushNotifications(channel)).rejects.toThrow(new Error('Request failed'));
    });
});

function createYoutubePayload(channel? : any) : Promise<Response> {
    return Promise.resolve(new Response(JSON.stringify({
            items: channel === undefined ? [] : [ channel ]
        }), {
            status: 200
        }
    ));
}

function createErrorPayload() : Promise<Response> {
    return Promise.reject(new Error("Request failed"));
}

function expectYoutubeApiCall(requestBuilder : IRequestBuilder, uri : string) : void {
    expect(requestBuilder.makeRequest).toHaveBeenCalledWith(
        `https://www.googleapis.com/youtube/v3/${uri}`,
        {
            method: "GET",
        }
    );
}

function getTestYoutubeChannel() : IYoutubeChannel {
    return new YoutubeChannel("test", {
        items: [
            { id : "UCJU7oHhmt-EUa8KNfpuvDhA" }
        ]
    });
}