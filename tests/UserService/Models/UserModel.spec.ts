import MockDB from "../../mocks/MockDB";
import User from "../../../src/UserService/Models/UserModel";
import IUser from "../../../src/UserService/Models/IUser";
import YoutubeChannel from "../../../src/UserService/Models/YoutubeChannel";
import IYoutubeChannel from "../../../src/UserService/Models/IYoutubeChannel";
import TwitchUser from "../../../src/UserService/Models/TwitchUser";

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

test("Should find a user", async () => {
    const channel : IYoutubeChannel = createYoutubeChannel("foo", "bar", "baz");
    const user : IUser = await createUser(0, channel);

    const result : IUser = await User.findById(user.id).exec() as IUser;

    expect(Array.from(result.webhooks)).toEqual([]);
    expect(result.youtubeChannel).toMatchObject({
        channelName: "foo",
        title: "baz",
        youtubeID: "bar"
    });
    expect(result.twitchID).toEqual(0);
});

test("Should find a null user", async () => {
    const result : IUser | null = await User.findById("41224d776a326fb40f000001").exec();
    
    expect(result).toBeNull();
});

test("Should remove a user", async () => {
    const user : IUser = await createUser(0, createYoutubeChannel("foo", "bar", "baz"));

    await user.remove();

    const result : IUser | null = await User.findById(user.id).exec();
    expect(result).toBeNull();
});

test("Should get twitch user", async () => {
    const user : IUser = await createUser(0, createYoutubeChannel("foo", "bar", "baz"));

    const result : IUser = await User.findById(user.id).exec() as IUser;

    expect(result.getTwitchUser()).toEqual(new TwitchUser(0));
});

async function createUser(twitchID : number, youtubeChannel : IYoutubeChannel) : Promise<IUser> {
    const user : IUser = new User({
        twitchID,
        youtubeChannel
    });
    return user.save();
}

function createYoutubeChannel(name : string, id : string, title : string) : IYoutubeChannel {
    return new YoutubeChannel(name, {
        items: [{
            id,
            snippet: {
                title
            }
        }]
    });
}