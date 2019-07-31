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
import IUser from "../../../src/UserService/Models/IUser";
import ITwitchUser from "../../../src/UserService/Models/ITwitchUser";
import YoutubeChannel from "../../../src/UserService/Models/YoutubeChannel";
import IYoutubeChannel from "../../../src/UserService/Models/IYoutubeChannel";

const schema : IValidationSchema = new ValidationSchema(WebhookSchema);
const router : CallbackRouter = new CallbackRouter(new MockLogger());
router.setup();

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

describe("handleCallback", () => {
    describe("Create Video", () => {
        test("Saves created video notification to database", async() => {
            await createUser(new TwitchUser(0), createYoutubeChannel("foo", "channelID", "bar"));
            const request : any = mockRequest({
                body: getCreateVideoBody()
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
    
        test("Ensure no duplicate notifications", async() => {
            await createUser(new TwitchUser(0), createYoutubeChannel("foo", "channelID", "bar"));
            const request : any = mockRequest({
                body: getCreateVideoBody()
            });
            const response : any = MockResponse();
            const expectedLength : number = 1;

            await router.handleCallback(request, response);
            await router.handleCallback(request, response);
    
            const notifications : ICreatedVideoNotification[] = (await CreatedVideoNotification.find().exec());
    
            expect(notifications).toHaveLength(expectedLength);
            expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
        });
    
        test("Fails to query db", async() => {
            const prop : any = UserModel.findOne;
            UserModel.findOne = jest.fn().mockReturnValueOnce({
                exec: async () : Promise<any> => {
                    return Promise.reject(new Error("Failed to query db"));
                }
            });
            const request : any = mockRequest({
                body: getCreateVideoBody()
            });
            const response : any = MockResponse();
    
            await expect(router.handleCallback(request, response)).rejects.toThrow(new Error("Failed to query db"));
            UserModel.findOne = prop;
        });
    
        test("Does not find user", async() => {
            const request : any = mockRequest({
                body: getCreateVideoBody()
            });
            const response : any = MockResponse();
    
            await router.handleCallback(request, response);
    
            expect(response.status).toHaveBeenCalledWith(StatusCodes.InternalError);
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

async function createUser(twitchUser : ITwitchUser, youtubeChannel : IYoutubeChannel) : Promise<IUser> {
    const user : IUser = new UserModel({
        twitchUser,
        youtubeChannel
    });
    return user.save();
} 
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