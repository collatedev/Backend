import CallbackRouter from "../../../src/YoutubeWatcher/Routes/CallbackRouter";
import MockLogger from "../../mocks/MockLogger";
import mockRequest from "../../mocks/MockRequest";
import MockResponse from "../../mocks/MockResponse";
import StatusCodes from "../../../src/Router/StatusCodes";
import IRouteHandler from "../../../src/Router/IRouteHandler";
import IValidationSchema from "../../../src/RequestValidator/ValidationSchema/IValidationSchema";
import ValidationSchema from "../../../src/RequestValidator/ValidationSchema/ValidationSchema";
import WebhookSchema from "../../../src/RequestSchemas/WebhookChallengeRequest.json";
import ErrorMessage from "../../../src/Router/Messages/ErrorMessage";
import validate from "../../../src/Router/Middleware/Validate";
import MockDB from "../../mocks/MockDB";
import ICreatedVideoNotification from "../../../src/Notification/Youtube/ICreatedVideoNotification";
import CreatedVideoNotification from "../../../src/Notification/Youtube/CreatedVideoNotification";
import NotificationType from "../../../src/Notification/NotificationType";
import UserModel from "../../../src/UserService/Models/UserModel";
import TwitchUser from "../../../src/UserService/Models/TwitchUser";
import YoutubeChannel from "../../../src/UserService/Models/YoutubeChannel";
import IYoutubeChannel from "../../../src/UserService/Models/IYoutubeChannel";
import YoutubeVideoPayload from "../../Payload/YoutubeVideoPayload";

const schema : IValidationSchema = new ValidationSchema(WebhookSchema);
const router : CallbackRouter = new CallbackRouter(new MockLogger());
const youtubeVideoPayload : any = YoutubeVideoPayload;
router.setup();

const db : MockDB = new MockDB();

beforeAll(async () => {
    await db.start();
});

afterAll(async () => {
    await db.stop();
});

afterEach(async () => {
    await db.cleanup();
});

describe("constructor", () => {
    test("It checks that the route has the proper path", () => {
    
        expect(router.getPath()).toEqual("/api/v1/youtube");
    });
});

describe("handleChallenge", () => {
    test("It fails due to missing challenge", () => {
        const request : any = mockRequest({
			query: {
				"hub.topic": "http://foo.com",
				"hub.mode": "subscribe",
            },
            headers: {}
		});
        const response : any = MockResponse();

        const middleWare : IRouteHandler = validate(schema);
        middleWare(request, response);
        expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
		expect(response.json).toHaveBeenCalledWith(new ErrorMessage([
            {
                message: "Missing property 'hub.challenge'",
                location: "query"
            }
        ]));
    });

    test("It fails due to missing topic", () => {
        const request : any = mockRequest({
			query: {
                "hub.mode": "subscribe",
                "hub.challenge": "challenge_token"
            },
            headers: {}
		});
        const response : any = MockResponse();

        const middleWare : IRouteHandler = validate(schema);
        middleWare(request, response);
        expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
		expect(response.json).toHaveBeenCalledWith(new ErrorMessage([
            {
                message: "Missing property 'hub.topic'",
                location: "query"
            }
        ]));
    });

    test("It fails due to missing mode", () => {
        const request : any = mockRequest({
			query: {
                "hub.topic": "http://foo.com",
                "hub.challenge": "challenge_token"
            },
            headers: {}
		});
        const response : any = MockResponse();

        const middleWare : IRouteHandler = validate(schema);
        middleWare(request, response);
        expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
		expect(response.json).toHaveBeenCalledWith(new ErrorMessage([
            {
                message: "Missing property 'hub.mode'",
                location: "query"
            }
        ]));
    });

    test("It fails due to extra property", () => {
        const request : any = mockRequest({
			query: {
                "hub.topic": "http://foo.com",
                "hub.mode": "subscribe",
                "hub.challenge": "challenge_token",
                "hub.malicious": "malicious data"
            },
            headers: {}
		});
        const response : any = MockResponse();

        const middleWare : IRouteHandler = validate(schema);
        middleWare(request, response);
        expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
		expect(response.json).toHaveBeenCalledWith(new ErrorMessage([
            {
                message: "Unexpected property 'hub.malicious'",
                location: "query"
            }
        ]));
    });

    test("It fails due to having a body", () => {
        const request : any = mockRequest({
			query: {
                "hub.topic": "http://foo.com",
                "hub.mode": "subscribe",
                "hub.challenge": "challenge_token"
            },
            body: "Malicious body",
            headers: {}
		});
        const response : any = MockResponse();

        const middleWare : IRouteHandler = validate(schema);
        middleWare(request, response);
        expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
		expect(response.json).toHaveBeenCalledWith(new ErrorMessage([
            {
                message: "Unexpected property 'body'",
                location: ""
            }
        ]));
    });

    test("It sends back the correct challenge value", async () => {
        const request : any = mockRequest({
			query: {
				"hub.topic": "value",
				"hub.mode": "value",
				"hub.lease_seconds": 123,
				"hub.challenge": "challenge_token"
            },
            headers: {}
		});
        const response : any = MockResponse();

        await router.handleChallenge(request, response);

		expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
		expect(response.send).toHaveBeenCalledWith("challenge_token");
    });
});

describe("handleCallback", () => {
    beforeEach(() => {
        UserModel.findUserByYoutubeID = jest.fn().mockReturnValue(
            Promise.resolve({
                id: "foo",
                twitchUser: new TwitchUser(0),
                youtubeChannel: createYoutubeChannel("foo", "channelID", "bar")
            })
        );
    });

    describe("Create Video", () => {
        test("Saves created video notification to database", async() => {
            const request : any = mockRequest({
                body: youtubeVideoPayload
            });
            const response : any = MockResponse();
    
            await router.handleCallback(request, response);
    
            const notification : ICreatedVideoNotification = (await CreatedVideoNotification.find().exec())[0];
    
            expect(notification.channelID).toEqual("channelID");
            expect(notification.createdAt).toBeInstanceOf(Date);
            expect(notification.datePublished).toEqual(new Date(1));
            expect(typeof notification.fromUserID).toEqual("string");
            expect(notification.link).toEqual("link");
            expect(notification.title).toEqual("title");
            expect(notification.type).toEqual(NotificationType.Youtube.CreateVideo);
            expect(notification.videoID).toEqual("videoID");
            expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
        });
    
        test("Fails to query db", async() => {
            UserModel.findUserByYoutubeID = jest.fn().mockReturnValueOnce(
                Promise.reject(new Error("Failed to query db"))
            );
            const request : any = mockRequest({
                body: youtubeVideoPayload
            });
            const response : any = MockResponse();
    
            await router.handleCallback(request, response);
            expect(response.status).toHaveBeenCalledWith(StatusCodes.InternalError);
        });
    
        test("Does not find user", async() => {
            UserModel.findUserByYoutubeID = jest.fn().mockReturnValueOnce(
                Promise.resolve(null)
            );
            const request : any = mockRequest({
                body: youtubeVideoPayload
            });
            const response : any = MockResponse();
    
            await router.handleCallback(request, response);
    
            expect(response.status).toHaveBeenCalledWith(StatusCodes.InternalError);
        });
    });

    describe("Delete Video", () => {
        test("Deletes video notification from database",  async () => {
            await createNotification("foo");
            const request : any = mockRequest({
                body: getDeleteVideoBody()
            });
            const response : any = MockResponse();
    
            await router.handleCallback(request, response);

            expect(await CreatedVideoNotification.find().exec()).toHaveLength(0);
            expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
        });

        test("Fails to query db", async () => {
            const prop : any = CreatedVideoNotification.deleteOne;
            CreatedVideoNotification.deleteOne = jest.fn().mockReturnValueOnce({
                exec: async () : Promise<any> => {
                    return Promise.reject(new Error("Failed to query db"));
                }
            });
            const request : any = mockRequest({
                body: getDeleteVideoBody()
            });
            const response : any = MockResponse();
    
            await router.handleCallback(request, response);
            expect(response.status).toHaveBeenCalledWith(StatusCodes.InternalError);
            CreatedVideoNotification.deleteOne = prop;
        });
    });

    describe("Update title", () => {
        test("Updates video title form database", async () => {
            const createdNotification : ICreatedVideoNotification = await createNotification("foo");
            const request : any = mockRequest({
                body: youtubeVideoPayload
            });
            request.body.feed.entry[0].title[0] = "update";
            const response : any = MockResponse();
    
            await router.handleCallback(request, response);

            const notification : ICreatedVideoNotification = 
                await CreatedVideoNotification.findById(createdNotification.id).exec()as ICreatedVideoNotification;

            expect(notification.title).toEqual("update");
            expect(notification.id).toEqual(createdNotification.id);
            expect(await CreatedVideoNotification.find().exec()).toHaveLength(1);
        });
    });
});

function createYoutubeChannel(name : string, id: string, title : string) : IYoutubeChannel {
    return new YoutubeChannel(name, {
        items: [{ 
            id,
            snippet: {
                title
            }
        }]
    });
}

function createNotification(userID : string) : Promise<ICreatedVideoNotification> {
    return new CreatedVideoNotification({
        type: NotificationType.Youtube.CreateVideo,
        channelID: "channelID",
        datePublished: new Date(1),
        fromUserID: userID,
        link: "link",
        title: "title",
        videoID: "videoID"
    }).save();
}

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