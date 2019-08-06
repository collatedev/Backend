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
    await createNotification(new Date("October 13, 2014 11:13:00"));
    await createNotification(new Date("October 13, 2012 11:13:00"));
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
    
    expect(response.json).toHaveBeenCalledWith(new DataMessage([
        {
            type : NotificationType.Youtube.CreateVideo,
            fromUserID : "userID",
            createdAt : new Date("October 13, 2014 11:13:00"),
            channelID: "channelID",
            datePublished: new Date(0),
            userID: "userID",
            link: "link",
            title: "title",
            videoID: "videoID",
        },
        {
            type : NotificationType.Youtube.CreateVideo,
            fromUserID : "userID",
            createdAt : new Date("October 13, 2012 11:13:00"),
            channelID: "channelID",
            datePublished: new Date(0),
            userID: "userID",
            link: "link",
            title: "title",
            videoID: "videoID",
        }
    ]));
    expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
});

test("Fails to get a feed for a user", async () => {
    const prop : any = Notification.find;
    Notification.find = jest.fn().mockReturnValue({
        sort() : any {
            throw new Error("Failed to query database")
        }
    });

    await createNotification(new Date("October 13, 2014 11:13:00"));
    await createNotification(new Date("October 13, 2012 11:13:00"));
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

async function createNotification(date : Date) : Promise<INotification> {
    return new YoutubeVideoModel({
        createdAt: date,
        type: NotificationType.Youtube.CreateVideo,
        title: "title",
        videoID: "videoID",
        channelID: "channelID",
        datePublished: new Date(0),
        fromUserID: "fromUserID",
        link: "link"
    }).save();
}