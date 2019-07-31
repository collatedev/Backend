import MockDB from "../mocks/MockDB";
import NotificationSchema from "../../src/Notification/Notification";
import INotification from "../../src/Notification/INotification";
import NotificationType from "../../src/Notification/NotificationType";

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

test("It should create a notificiation", async () => {
    const notification : INotification = new NotificationSchema({
        type: NotificationType.Youtube.CreateVideo,
        fromUserID: "foo"
    });
    
    await notification.save();

    expect(notification.type).toEqual("Youtube:CreateVideo");
    expect(notification.createdAt).toBeInstanceOf(Date);
    expect(notification.fromUserID).toEqual("foo");
});

test("It should create and find notificiation", async () => {
    const notification : INotification = new NotificationSchema({
        type: NotificationType.Youtube.CreateVideo,
        fromUserID: "foo"
    });
    await notification.save();

    const foundNotification : INotification = 
        await NotificationSchema.findById(notification.id).exec() as INotification;
    
    expect(foundNotification.type).toEqual("Youtube:CreateVideo");
    expect(foundNotification.createdAt).toBeInstanceOf(Date);
    expect(foundNotification.fromUserID).toEqual("foo");
});

test("It should fail to call is duplicate", async () => {
    const notification : INotification = new NotificationSchema({
        type: NotificationType.Youtube.CreateVideo,
        fromUserID: "foo"
    });
    
    await expect(notification.isDuplicate()).rejects.toThrowError("Abstract method can not be called");
});