import IYoutube from "../../../src/YoutubeWatcher/Youtube/IYoutube";
import Youtube from "../../../src/YoutubeWatcher/Youtube/Youtube";
import IYoutubeChannel from "../../../src/UserService/Models/IYoutubeChannel";
import { Response } from "node-fetch";
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
        FetchRequestBuilder.prototype.makeRequest = jest.fn().mockReturnValueOnce(createYoutubePayload({
            id: "bar",
            snippet: {
                title: "Test Title"
            }
        }));
        const youtube : IYoutube = new Youtube();

        const channel : IYoutubeChannel = await youtube.getChannel("foo");

        expectYoutubeApiCall('channels?part=snippet%2CcontentDetails%2Cstatistics&forUsername=foo&key=api_key');
        expect(channel.channelName).toEqual("foo");
        expect(channel.youtubeID).toEqual("bar");
        expect(channel.title).toEqual("Test Title");
    });

    test("It fails to gets a channel by name", async () => {
        process.env.YOUTUBE_API_KEY = "api_key";
        FetchRequestBuilder.prototype.makeRequest = jest.fn().mockReturnValueOnce(createErrorPayload());
        const youtube : IYoutube = new Youtube();

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

        const youtube : IYoutube = new Youtube();

        const channel : IYoutubeChannel = await youtube.getChannel("foo");

        expectYoutubeApiCall('channels?part=snippet%2CcontentDetails%2Cstatistics&forUsername=foo&key=api_key');
        expectYoutubeApiCall('channels?part=snippet%2CcontentDetails%2Cstatistics&id=foo&key=api_key');
        expect(channel.channelName).toEqual("Test Title");
        expect(channel.youtubeID).toEqual("bar");
    });

    test("It fails to get a channel by id", async () => {
        process.env.YOUTUBE_API_KEY = "api_key";
        FetchRequestBuilder.prototype.makeRequest = jest.fn()
            .mockReturnValueOnce(createYoutubePayload())
            .mockReturnValueOnce(createErrorPayload());
        const youtube : IYoutube = new Youtube();

        await expect(youtube.getChannel("foo")).rejects.toThrow(new Error('Request failed'));
    });

    test("It fails to find a channel", async () => {
        process.env.YOUTUBE_API_KEY = "api_key";
        FetchRequestBuilder.prototype.makeRequest = jest.fn()
            .mockReturnValueOnce(createYoutubePayload())
            .mockReturnValueOnce(createYoutubePayload());
        const youtube : IYoutube = new Youtube();

        await expect(youtube.getChannel("foo")).rejects.toThrow(
            new Error('Could not find a youtube channel by name or id of "foo"')
        );
    });
});

describe("subscribeToPushNotifications", () => {
    test("It subscribes to a channels push notifications", async () => {
        process.env.NODE_ENV = "test";
        process.env.YOUTUBE_API_KEY = "api_key";
        FetchRequestBuilder.prototype.makeRequest = jest.fn().mockReturnValueOnce(getVerificationResponse());
        const youtube : IYoutube = new Youtube();
        const channel : IYoutubeChannel = getTestYoutubeChannel("test", "UCJU7oHhmt-EUa8KNfpuvDhA", "bar");

        await youtube.subscribeToPushNotifications(channel);

        expect(FetchRequestBuilder.prototype.makeRequest).toHaveBeenCalledWith(
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
        FetchRequestBuilder.prototype.makeRequest = jest.fn().mockReturnValueOnce(createErrorPayload());
        const youtube : IYoutube = new Youtube();
        const channel : IYoutubeChannel = getTestYoutubeChannel("test", "UCJU7oHhmt-EUa8KNfpuvDhA", "bar");

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

function expectYoutubeApiCall(uri : string) : void {
    expect(FetchRequestBuilder.prototype.makeRequest).toHaveBeenCalledWith(
        `https://www.googleapis.com/youtube/v3/${uri}`,
        {
            method: "GET",
        }
    );
}

function getTestYoutubeChannel(name : string, id: string, title: string) : IYoutubeChannel {
    return new YoutubeChannel(name, {
        items: [
            { 
                id,
                snippet: {
                    title
                }
            }
        ]
    });
}

function getVerificationResponse() : Promise<Response> {
    return Promise.resolve(new Response("", {
        status: 202
    }));
}