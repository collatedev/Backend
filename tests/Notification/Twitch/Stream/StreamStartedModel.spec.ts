import IStreamStarted from "../../../../src/Notification/Twitch/Stream/IStreamStarted";
import StreamStartedModel from "../../../../src/Notification/Twitch/Stream/StreamStartedModel";
import StreamBody from "../../../../src/TwitchWatcher/RequestBody/request/StreamBody";
import MockDB from "../../../mocks/MockDB";
import NotificationType from "../../../../src/Notification/NotificationType";

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


test("It creates a stream started model from a stream data payload", () => {
    const user : any = {
        id: "userID"
    };
    const streamStarted : IStreamStarted = StreamStartedModel.createFromBody(new StreamBody({
        data: [{
            id: 0,
            user_id: 0,
            user_name: "foo",
            game_id: 0,
            community_ids: [],
            type: "bar",
            title: "title",
            viewer_count: 0,
            started_at: new Date(),
            language: "en",
            thumbnail_url: "url"
        }]
    }), user);

    expect(Array.from(streamStarted.communityIDs)).toEqual([]);
    expect(streamStarted.gameID).toEqual(0);
    expect(streamStarted.language).toEqual("en");
    expect(streamStarted.startedAt).toBeInstanceOf(Date);
    expect(streamStarted.thumbnailURL).toEqual("url");
    expect(streamStarted.title).toEqual("title");
    expect(streamStarted.twitchUserName).toEqual("foo");
    expect(streamStarted.type).toEqual(NotificationType.Twitch.StreamStarted);
    expect(streamStarted.streamType).toEqual("bar");
    expect(streamStarted.userID).toEqual("userID");
    expect(streamStarted.viewerCount).toEqual(0);
});