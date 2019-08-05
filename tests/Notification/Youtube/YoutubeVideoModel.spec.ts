import MockDB from "../../mocks/MockDB";
import YoutubeVideoModel from "../../../src/Notification/Youtube/YoutubeVideoModel";
import IYoutubeVideo from "../../../src/Notification/Youtube/IYoutubeVideo";
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
    const notification : IYoutubeVideo = new YoutubeVideoModel({
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

test("that the notification is not a duplicate", async () => {
    const created : IYoutubeVideo = new YoutubeVideoModel({
        type: NotificationType.Youtube.CreateVideo,
        title: "title",
        videoID: "videoID",
        channelID: "channelID",
        datePublished: new Date(1),
        fromUserID: "fromUserID",
        link: "link"
    });
    
    expect(await created.isDuplicate()).toBeFalsy();
});

test("that the notification is not a duplicate", async () => {
    const created : IYoutubeVideo = new YoutubeVideoModel({
        type: NotificationType.Youtube.CreateVideo,
        title: "title",
        videoID: "videoID",
        channelID: "channelID",
        datePublished: new Date(1),
        fromUserID: "fromUserID",
        link: "link"
    });
    await created.save();
    
    expect(await created.isDuplicate()).toBeFalsy();
});

test("that the notification is a duplicate", async () => {
    const created1 : IYoutubeVideo = new YoutubeVideoModel({
        type: NotificationType.Youtube.CreateVideo,
        title: "title",
        videoID: "videoID",
        channelID: "channelID",
        datePublished: new Date(1),
        fromUserID: "fromUserID",
        link: "link"
    });
    const created2 : IYoutubeVideo = new YoutubeVideoModel({
        type: NotificationType.Youtube.CreateVideo,
        title: "title",
        videoID: "videoID",
        channelID: "channelID",
        datePublished: new Date(1),
        fromUserID: "fromUserID",
        link: "link"
    });
    await created1.save();
    
    expect(await created2.isDuplicate()).toBeTruthy();
});

test("Can find a notification by video ID", async () => {
    await new YoutubeVideoModel({
        type: NotificationType.Youtube.CreateVideo,
        title: "title",
        videoID: "videoID",
        channelID: "channelID",
        datePublished: new Date(1),
        fromUserID: "fromUserID",
        link: "link"
    }).save();
    
    const notification : IYoutubeVideo =
        await YoutubeVideoModel.findByVideoID("videoID") as IYoutubeVideo;
    
    expect(notification).not.toBeNull();
    expect(notification.videoID).toEqual("videoID");
});

test("Does not find a notification by video ID", async () => {    
    expect(await YoutubeVideoModel.findByVideoID("videoID")).toBeNull();
});