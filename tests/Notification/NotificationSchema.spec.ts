import MockDB from "../mocks/MockDB";
import NotificationSchema from "../../src/Notification/NotificationSchema";
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

    const foundNotification : INotification | null = await NotificationSchema.findById(notification.id).exec();
    
    if (foundNotification === null) {
        fail("Did not find notification");
    } else {
        expect(foundNotification.type).toEqual("Youtube:CreateVideo");
            expect(foundNotification.createdAt).toBeInstanceOf(Date);
        expect(foundNotification.fromUserID).toEqual("foo");
    }
});