import DeletedVideoPayload from "../../../src/YoutubeWatcher/Payload/DeletedVideo";
import mockRequest from "../../mocks/MockRequest";
import { IDeletedVideoPayload } from "../../../src/YoutubeWatcher/Payload/IDeletedVideo";

test("It should fail to create payload due to missing feed", () => {
    const request : any = mockRequest({
        body: getDeleteVideoBody()
    });
    
    delete request.body.feed;

    expect(() => {
        return new DeletedVideoPayload(request);
    }).toThrow(new Error("Request missing feed"));
});

test("It should fail to create payload due to missing entry", () => {
    const request : any = mockRequest({
        body: getDeleteVideoBody()
    });

    delete request.body.feed["at:deleted-entry"];

    expect(() => {
        return new DeletedVideoPayload(request);
    }).toThrow(new Error("Request missing deleted-entry"));
});

test("It should fail to create payload due to no entries", () => {
    const request : any = mockRequest({
        body: getDeleteVideoBody()
    });

    request.body.feed["at:deleted-entry"].pop();

    expect(() => {
        return new DeletedVideoPayload(request);
    }).toThrow(new Error("Request has no entries"));
});

test("It should fail to create payload due to missing $", () => {
    const request : any = mockRequest({
        body: getDeleteVideoBody()
    });

    delete request.body.feed["at:deleted-entry"][0].$;

    expect(() => {
        return new DeletedVideoPayload(request);
    }).toThrow(new Error("Request missing $"));
});

test("It should fail to create payload due to missing ref", () => {
    const request : any = mockRequest({
        body: getDeleteVideoBody()
    });

    delete request.body.feed["at:deleted-entry"][0].$.ref;

    expect(() => {
        return new DeletedVideoPayload(request);
    }).toThrow(new Error("Request missing ref"));
});

test("It should fail to create payload due to missing by", () => {
    const request : any = mockRequest({
        body: getDeleteVideoBody()
    });

    delete request.body.feed["at:deleted-entry"][0]["at:by"];

    expect(() => {
        return new DeletedVideoPayload(request);
    }).toThrow(new Error("Request missing by"));
});

test("It should fail to create payload due to missing uri", () => {
    const request : any = mockRequest({
        body: getDeleteVideoBody()
    });

    delete request.body.feed["at:deleted-entry"][0]["at:by"][0].uri;

    expect(() => {
        return new DeletedVideoPayload(request);
    }).toThrow(new Error("Request missing uri"));
});

test("It should create a payload", () => {
    const request : any = mockRequest({
        body: getDeleteVideoBody()
    });

    const payload : IDeletedVideoPayload = new DeletedVideoPayload(request);

    expect(payload.channelID()).toEqual("channelID");
    expect(payload.videoID()).toEqual("videoID");
});

function getDeleteVideoBody() : any {
    return {  
        "feed": {  
           "$":{  
                "xmlns:at":"http://purl.org/atompub/tombstones/1.0",
                "xmlns":"http://www.w3.org/2005/Atom"
            },
            "at:deleted-entry":[  
                {  
                    "$":{  
                        "ref":"yt:video:videoID",
                        "when":"2019-07-31T07:19:30+00:00"
                    },
                    "link":[  
                        {  
                            "$":{  
                                "href":"https://www.youtube.com/watch?v=BYgis73x8CM"
                            }
                        }
                    ],
                    "at:by":[  
                        {  
                            "name":[  
                                "Evan Coulson"
                            ],
                            "uri":[  
                                "https://www.youtube.com/channel/channelID"
                            ]
                        }
                    ]
                }
           ]
        }
    };
}