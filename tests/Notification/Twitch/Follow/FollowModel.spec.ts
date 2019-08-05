import MockDB from "../../../mocks/MockDB";
import IFollow from "../../../../src/Notification/Twitch/Follow/IFollow";
import FollowModel from "../../../../src/Notification/Twitch/Follow/FollowModel";
import FollowBody from "../../../../src/TwitchWatcher/RequestBody/request/FollowBody";

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

test("It should create a user followed notification", () => {
    const user : any = {
        id: "userID"
    };
    const follow : IFollow = FollowModel.createFollowedNotification(new FollowBody({
        data: [{
            from_id: 0,
            from_name: "foo",
            to_id: 1,
            to_name: "bar",
            followed_at: new Date(),
        }]
    }), user);

    expect(follow.fromID).toEqual("userID");
    expect(follow.fromTwitchID).toEqual(0);
    expect(follow.fromName).toEqual("foo");
    expect(follow.followedAt).toBeInstanceOf(Date);
    expect(follow.toTwitchID).toEqual(1);
    expect(follow.toName).toEqual("bar");
    expect(follow.toID).toBeNull();
});

test("It should create a new follower notification", () => {
    const user : any = {
        id: "userID"
    };
    const follow : IFollow = FollowModel.createFollowerNotification(new FollowBody({
        data: [{
            from_id: 0,
            from_name: "foo",
            to_id: 1,
            to_name: "bar",
            followed_at: new Date(),
        }]
    }), user);

    expect(follow.fromID).toBeNull();
    expect(follow.fromTwitchID).toEqual(0);
    expect(follow.fromName).toEqual("foo");
    expect(follow.followedAt).toBeInstanceOf(Date);
    expect(follow.toTwitchID).toEqual(1);
    expect(follow.toName).toEqual("bar");
    expect(follow.toID).toEqual("userID");
});