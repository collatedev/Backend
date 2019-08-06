import mockRequest from "../../mocks/MockRequest";
import FeedRouter from "../../../src/Feed/route/FeedRouter";
import MockLogger from "../../mocks/MockLogger";
import MockResponse from "../../mocks/MockResponse";
import DataMessage from "../../../src/Router/Messages/DataMessage";
import StatusCodes from "../../../src/Router/StatusCodes";
import MockDB from "../../mocks/MockDB";
import NotificationType from "../../../src/Notification/NotificationType";
import INotification from "../../../src/Notification/INotification";
import YoutubeVideoModel from "../../../src/Notification/Youtube/YoutubeVideoModel";
import ErrorMessage from "../../../src/Router/Messages/ErrorMessage";
import Notification from "../../../src/Notification/Notification";

const router : FeedRouter = new FeedRouter(new MockLogger());
const db : MockDB = new MockDB();
router.setup();

beforeAll(async () => {
    await db.start();
});

afterAll(async () => {
    await db.stop();
});

afterEach(async () => {
	await db.cleanup();
});

test("Gets a feed for a user", async () => {
    const document : any = getTestDocument(new Date("October 13, 2014 11:13:00"));
    await createNotification(document);
    const request : any = mockRequest({
        params: {
            userID: "foo"
        },
        query: {
            offset: 0
        }
    });
    const response : any = MockResponse();

    await router.getFeed(request, response);

    const payload : any = response.getJSON();
    expect(payload).toBeInstanceOf(DataMessage);
    expect(payload.data).toHaveLength(1);
    expect(payload.data[0]).toMatchObject(document);
    expect(response.json).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
});

test("Gets a feed for a user with dates descending", async () => {
    const document : any = getTestDocument(new Date("October 13, 2014 11:13:00"));
    const resultSize : number = 2;
    await createNotification(document);
    await createNotification(getTestDocument(new Date("October 13, 1 11:13:00")));
    const request : any = mockRequest({
        params: {
            userID: "foo"
        },
        query: {
            offset: 0
        }
    });
    const response : any = MockResponse();

    await router.getFeed(request, response);

    const payload : any = response.getJSON();
    expect(payload).toBeInstanceOf(DataMessage);
    expect(payload.data).toHaveLength(resultSize);
    expect(payload.data[0]).toMatchObject(document);
    expect(response.json).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
});

test("Gets a subset of the feed for a user", async () => {
    const queryResultLimit : number = 20;
    const testDocuments : number = 30;
    const document : any = getTestDocument(new Date(`October 13, 29 11:13:00`));
    for (let i : number = 0; i < testDocuments; i++) {
        await createNotification(getTestDocument(new Date(`October 13, ${i} 11:13:00`)));
    }

    const request : any = mockRequest({
        params: {
            userID: "foo"
        },
        query: {
            offset: 0
        }
    });
    const response : any = MockResponse();

    await router.getFeed(request, response);

    const payload : any = response.getJSON();
    expect(payload).toBeInstanceOf(DataMessage);
    expect(payload.data).toHaveLength(queryResultLimit);
    expect(payload.data[0]).toMatchObject(document);
    expect(response.json).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
});

test("Gets a subset of the feed for a user from an offset", async () => {
    const queryResultLimit : number = 20;
    const testDocuments : number = 30;
    const document : any = getTestDocument(new Date(`October 13, 27 11:13:00`));
    for (let i : number = 0; i < testDocuments; i++) {
        await createNotification(getTestDocument(new Date(`October 13, ${i} 11:13:00`)));
    }

    const request : any = mockRequest({
        params: {
            userID: "foo"
        },
        query: {
            offset: 2
        }
    });
    const response : any = MockResponse();

    await router.getFeed(request, response);

    const payload : any = response.getJSON();
    expect(payload).toBeInstanceOf(DataMessage);
    expect(payload.data).toHaveLength(queryResultLimit);
    expect(payload.data[0]).toMatchObject(document);
    expect(response.json).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
});

test("Fails to get a feed for a user", async () => {
    const prop : any = Notification.find;
    Notification.find = jest.fn().mockReturnValue({
        sort() : any {
            throw new Error("Failed to query database");
        }
    });

    const request : any = mockRequest({
        params: {
            userID: "foo"
        },
        query: {
            offset: 0
        }
    });
    const response : any = MockResponse();

    await router.getFeed(request, response);
    
    expect(response.json).toHaveBeenCalledWith(new ErrorMessage(new Error("Failed to query database")));
    expect(response.status).toHaveBeenCalledWith(StatusCodes.InternalError);
    Notification.find = prop;
});

async function createNotification(document : any) : Promise<INotification> {
    return new YoutubeVideoModel(document).save();
}

function getTestDocument(date : Date) : any {
    return {
        createdAt: date,
        type: NotificationType.Youtube.CreateVideo,
        title: "title",
        userID: "userID",
        videoID: "videoID",
        channelID: "channelID",
        datePublished: new Date(0),
        fromUserID: "fromUserID",
        link: "link"
    };
}