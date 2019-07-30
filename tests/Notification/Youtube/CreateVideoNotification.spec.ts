import MockDB from "../../mocks/MockDB";
import CreatedVideoNotification from "../../../src/Notification/Youtube/CreatedVideoNotification";
import ICreatedVideoNotification from "../../../src/Notification/Youtube/ICreatedVideoNotification";
import NotificationType from "../../../src/Notification/NotificationType";

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

test("creates a notification", async () => {
    const notification : ICreatedVideoNotification = new CreatedVideoNotification({
        type: NotificationType.Youtube.CreateVideo,
        title: "title",
        videoID: "videoID",
        channelID: "channelID",
        datePublished: new Date(1),
        fromUserID: "fromUserID",
        link: "link"
    });

    await notification.save();

    expect(notification.type).toEqual(NotificationType.Youtube.CreateVideo);
    expect(notification.title).toEqual("title");
    expect(notification.videoID).toEqual("videoID");
    expect(notification.channelID).toEqual("channelID");
    expect(notification.datePublished).toEqual(new Date(1));
    expect(notification.fromUserID).toEqual("fromUserID");
    expect(notification.link).toEqual("link");
});

test("finds a notification", async () => {
    const created : ICreatedVideoNotification = new CreatedVideoNotification({
        type: NotificationType.Youtube.CreateVideo,
        title: "title",
        videoID: "videoID",
        channelID: "channelID",
        datePublished: new Date(1),
        fromUserID: "fromUserID",
        link: "link"
    });
    await created.save();
    
    const notification : ICreatedVideoNotification = 
        await CreatedVideoNotification.findById(created._id).exec() as ICreatedVideoNotification;

    expect(notification.type).toEqual(NotificationType.Youtube.CreateVideo);
    expect(notification.title).toEqual("title");
    expect(notification.videoID).toEqual("videoID");
    expect(notification.channelID).toEqual("channelID");
    expect(notification.datePublished).toEqual(new Date(1));
    expect(notification.fromUserID).toEqual("fromUserID");
    expect(notification.link).toEqual("link");
});