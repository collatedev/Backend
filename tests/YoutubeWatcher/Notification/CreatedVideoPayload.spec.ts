import mockRequest from "../../mocks/MockRequest";
import ICreatedVideoPayload from "../../../src/YoutubeWatcher/Notification/ICreatedVideoPayload";
import CreatedVideoPayload from "../../../src/YoutubeWatcher/Notification/CreatedVideoPayload";

test("It creates a video payload", () => {
    const request : any = mockRequest({
        body: getCreateVideoBody()
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
        body: getCreateVideoBody()
    });

    delete request.body.feed;

    expect(() => {
        return new CreatedVideoPayload(request);
    }).toThrow(new Error("Request is missing feed"));
});

test("It fails to a payload due to missing entry", () => {
    const request : any = mockRequest({
        body: getCreateVideoBody()
    });

    delete request.body.feed.entry;

    expect(() => {
        return new CreatedVideoPayload(request);
    }).toThrow(new Error("Request is missing entry"));
});

test("It fails to a payload due to no entries", () => {
    const request : any = mockRequest({
        body: getCreateVideoBody()
    });

    request.body.feed.entry.pop();

    expect(() => {
        return new CreatedVideoPayload(request);
    }).toThrow(new Error("Request is has no entries"));
});

test("It fails to a payload due to missing channelID", () => {
    const request : any = mockRequest({
        body: getCreateVideoBody()
    });

    delete request.body.feed.entry[0]["yt:channelid"];

    expect(() => {
        return new CreatedVideoPayload(request);
    }).toThrow(new Error("Request is missing channelID"));
});

test("It fails to a payload due to missing datePublished", () => {
    const request : any = mockRequest({
        body: getCreateVideoBody()
    });

    delete request.body.feed.entry[0].published;

    expect(() => {
        return new CreatedVideoPayload(request);
    }).toThrow(new Error("Request is missing datePublished"));
});

test("It fails to a payload due to missing link", () => {
    const request : any = mockRequest({
        body: getCreateVideoBody()
    });

    delete request.body.feed.entry[0].link;

    expect(() => {
        return new CreatedVideoPayload(request);
    }).toThrow(new Error("Request is missing link"));
});

test("It fails to a payload due to missing title", () => {
    const request : any = mockRequest({
        body: getCreateVideoBody()
    });

    delete request.body.feed.entry[0].title;

    expect(() => {
        return new CreatedVideoPayload(request);
    }).toThrow(new Error("Request is missing title"));
});

test("It fails to a payload due to missing videoID", () => {
    const request : any = mockRequest({
        body: getCreateVideoBody()
    });

    delete request.body.feed.entry[0]["yt:videoid"];

    expect(() => {
        return new CreatedVideoPayload(request);
    }).toThrow(new Error("Request is missing videoID"));
});

function getCreateVideoBody() : any {
    return {
        "feed": {
            "$": {
                "xmlns:yt": "http://www.youtube.com/xml/schemas/2015",
                "xmlns": "http://www.w3.org/2005/Atom"
            },
            "link": [
                {
                    "$": {
                        "rel": "hub",
                        "href": "https://pubsubhubbub.appspot.com"
                    }
                },
                {
                    "$": {
                        "rel": "self",
                        "href": "https://www.youtube.com/xml/feeds/videos.xml?channel_id=UCJU7oHhmt-EUa8KNfpuvDhA"
                    }
                }
            ],
            "title": [
                "YouTube video feed"
            ],
            "updated": [
                "2019-07-30T08:07:48.581684321+00:00"
            ],
            "entry": [
                {
                    "id": [
                        "yt:video:WbzYmskEgDE"
                    ],
                    "yt:videoid": [
                        "videoID"
                    ],
                    "yt:channelid": [
                        "channelID"
                    ],
                    "title": [
                        "title"
                    ],
                    "link": [
                        {
                            "$": {
                                "rel": "alternate",
                                "href": "link"
                            }
                        }
                    ],
                    "author": [
                        {
                            "name": [
                                "Evan Coulson"
                            ],
                            "uri": [
                                "https://www.youtube.com/channel/UCJU7oHhmt-EUa8KNfpuvDhA"
                            ]
                        }
                    ],
                    "published": [
                        "1970-01-01T00:00:00.001Z"
                    ],
                    "updated": [
                        "2019-07-30T08:07:48.581684321+00:00"
                    ]
                }
            ]
        }
    };
}