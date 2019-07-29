import MockDB from "../../mocks/MockDB";
import User from "../../../src/UserService/Models/UserModel";
import IUser from "../../../src/UserService/Models/IUser";
import YoutubeChannel from "../../../src/UserService/Models/YoutubeChannel";
import IYoutubeChannel from "../../../src/UserService/Models/IYoutubeChannel";
import TwitchUser from "../../../src/UserService/Models/TwitchUser";
import ITwitchUser from "../../../src/UserService/Models/ITwitchUser";

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
    const twitchUser : ITwitchUser = new TwitchUser(0);
    const user : IUser = await createUser(twitchUser, channel);

    const result : IUser = await User.findById(user.id).exec() as IUser;

    expect(Array.from(result.webhooks)).toEqual([]);
    expect(result.youtubeChannel).toMatchObject({
        channelName: "foo",
        title: "baz",
        youtubeID: "bar"
    });
    expect(result.twitchUser).toMatchObject({
        userID: 0
    });
});

test("Should find a null user", async () => {
    const result : IUser | null = await User.findById("41224d776a326fb40f000001").exec();
    
    expect(result).toBeNull();
});

test("Should remove a user", async () => {
    const user : IUser = await createUser(
        new TwitchUser(0), 
        createYoutubeChannel("foo", "bar", "baz")
    );

    await user.remove();

    const result : IUser | null = await User.findById(user.id).exec();
    expect(result).toBeNull();
});

async function createUser(twitchUser : ITwitchUser, youtubeChannel : IYoutubeChannel) : Promise<IUser> {
    const user : IUser = new User({
        twitchUser,
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