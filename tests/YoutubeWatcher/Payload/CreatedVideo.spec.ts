import mockRequest from "../../mocks/MockRequest";
import ICreatedVideoPayload from "../../../src/YoutubeWatcher/Payload/ICreatedVideo";
import CreatedVideoPayload from "../../../src/YoutubeWatcher/Payload/CreatedVideo";
import CreateVideoPayload from "../../Payload/CreateVideoPayload";

test("It creates a video payload", () => {
    const request : any = mockRequest({
        body: CreateVideoPayload()
    });

    const payload : ICreatedVideoPayload = new CreatedVideoPayload(request);

    expect(payload.channelID()).toEqual("channelID");
    expect(payload.datePublished()).toEqual(new Date(1));
    expect(payload.link()).toEqual("link");
    expect(payload.title()).toEqual("title");
    expect(payload.videoID()).toEqual("videoID");
});

test("It fails to a payload due to missing feed", () => {
    const request : any = mockRequest({
        body: CreateVideoPayload()
    });

    delete request.body.feed;

    expect(() => {
        return new CreatedVideoPayload(request);
    }).toThrow(new Error("Request is missing feed"));
});

test("It fails to a payload due to missing entry", () => {
    const request : any = mockRequest({
        body: CreateVideoPayload()
    });

    delete request.body.feed.entry;

    expect(() => {
        return new CreatedVideoPayload(request);
    }).toThrow(new Error("Request is missing entry"));
});

test("It fails to a payload due to no entries", () => {
    const request : any = mockRequest({
        body: CreateVideoPayload()
    });

    request.body.feed.entry.pop();

    expect(() => {
        return new CreatedVideoPayload(request);
    }).toThrow(new Error("Request is has no entries"));
});

test("It fails to a payload due to missing channelID", () => {
    const request : any = mockRequest({
        body: CreateVideoPayload()
    });

    delete request.body.feed.entry[0]["yt:channelid"];

    expect(() => {
        return new CreatedVideoPayload(request);
    }).toThrow(new Error("Request is missing channelID"));
});

test("It fails to a payload due to missing datePublished", () => {
    const request : any = mockRequest({
        body: CreateVideoPayload()
    });

    delete request.body.feed.entry[0].published;

    expect(() => {
        return new CreatedVideoPayload(request);
    }).toThrow(new Error("Request is missing datePublished"));
});

test("It fails to a payload due to missing link", () => {
    const request : any = mockRequest({
        body: CreateVideoPayload()
    });

    delete request.body.feed.entry[0].link;

    expect(() => {
        return new CreatedVideoPayload(request);
    }).toThrow(new Error("Request is missing link"));
});

test("It fails to a payload due to missing title", () => {
    const request : any = mockRequest({
        body: CreateVideoPayload()
    });

    delete request.body.feed.entry[0].title;

    expect(() => {
        return new CreatedVideoPayload(request);
    }).toThrow(new Error("Request is missing title"));
});

test("It fails to a payload due to missing videoID", () => {
    const request : any = mockRequest({
        body: CreateVideoPayload()
    });

    delete request.body.feed.entry[0]["yt:videoid"];

    expect(() => {
        return new CreatedVideoPayload(request);
    }).toThrow(new Error("Request is missing videoID"));
});