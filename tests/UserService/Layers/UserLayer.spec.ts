import IUserLayer from '../../../src/UserService/layers/IUserLayer';
import UserLayer from '../../../src/UserService/layers/UserLayer';
import IUser from '../../../src/UserService/Models/IUser';
import YoutubeChannel from '../../../src/UserService/Models/YoutubeChannel';
import IYoutubeChannel from '../../../src/UserService/Models/IYoutubeChannel';
import MockDB from '../../mocks/MockDB';
import UserModel from '../../../src/UserService/Models/UserModel';
import Youtube from '../../../src/YoutubeWatcher/Youtube/Youtube';
import TwitchService from '../../../src/TwitchWatcher/Twitch/TwitchService';
import MockLogger from '../../mocks/MockLogger';
import NewUserData from '../../../src/UserService/Layers/NewUserData';

jest.mock('../../../src/YoutubeWatcher/Youtube/Youtube');
jest.mock('../../../src/TwitchWatcher/Twitch/TwitchService');

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

describe('getUserInfo', () => {
    it('Should get a user with id 1', async () => {
        const channel : IYoutubeChannel = createYoutubeChannel("foo", "bar", "baz");
        Youtube.prototype.getChannel = jest.fn().mockReturnValueOnce(Promise.resolve(channel));
        const layer : IUserLayer = getUserLayer();
        const savedUser : IUser = await createUser(1, channel);

        const user : IUser = await layer.getUserInfo(savedUser.id);

        expect(user.twitchID).toEqual(1);
        expect(user.youtubeChannel).toMatchObject({
            channelName: "foo",
            youtubeID: "bar",
            title: "baz"
        });
        expect(Array.from(user.webhooks)).toEqual([]);
    });

    it('Should fail to find a user with id 1', async () => {
        const layer : IUserLayer = getUserLayer();

        await expect(layer.getUserInfo("41224d776a326fb40f000001"))
            .rejects.toThrow(new Error("User with id = \"41224d776a326fb40f000001\" not found"));
    });
});

describe("subscribe", () => {
    test("Should subscribe to webhooks", async () => {
        const channel : IYoutubeChannel = createYoutubeChannel("foo", "bar", "baz");
        const layer : IUserLayer = getUserLayer();
        const savedUser : IUser = await createUser(1, channel);

        const user : IUser = await layer.subscribe(savedUser);

        expect(user.twitchID).toEqual(1);
        expect(user.youtubeChannel).toEqual(channel);
        expect(Array.from(user.webhooks)).toEqual([]);
    });

    test("Should fail to subscribe to webhooks", async () => {
        const channel : IYoutubeChannel = createYoutubeChannel("foo", "bar", "baz");
        const user : IUser = await createUser(1, channel);
        TwitchService.prototype.subscribe = jest.fn().mockReturnValueOnce(
            Promise.reject(new Error("Subscription failed"))
        );
        const layer : IUserLayer = getUserLayer();

        await expect(layer.subscribe(user)).rejects.toThrow(new Error("Subscription failed"));
    });
});

describe("unsubscribe", () => {
    test("Should unsubscribe to webhooks", async () => {
        const channel : IYoutubeChannel = createYoutubeChannel("foo", "bar", "baz");
        const layer : IUserLayer = getUserLayer();
        const savedUser : IUser = await createUser(1, channel);

        const user : IUser = await layer.unsubscribe(savedUser);

        expect(user.twitchID).toEqual(1);
        expect(user.youtubeChannel).toEqual(channel);
        expect(Array.from(user.webhooks)).toEqual([]);
    });

    test("Should fail to unsubscribe to webhooks", async () => {
        const channel : IYoutubeChannel = createYoutubeChannel("foo", "bar", "baz");
        const savedUser : IUser = await createUser(1, channel);
        TwitchService.prototype.unsubscribe = jest.fn().mockReturnValueOnce(
            Promise.reject(new Error("Subscription failed"))
        );
        const layer : IUserLayer = getUserLayer();

        await expect(layer.unsubscribe(savedUser)).rejects.toThrow(new Error("Subscription failed"));
    });
});

describe("createUser", () => {
    test("successfully create user", async () => {
        const channel : IYoutubeChannel = createYoutubeChannel("foo", "bar", "baz");
        Youtube.prototype.getChannel = jest.fn().mockReturnValue(channel);
        const layer : IUserLayer = getUserLayer();

        const user : IUser = await layer.createUser(new NewUserData({
            twitchUserID: 1,
            youtubeChannelName: "foo"
        }));


        expect(user.youtubeChannel).toEqual(channel);
        expect(Array.from(user.webhooks)).toEqual([]);
        expect(user.twitchID).toEqual(1);
    });
});

function createYoutubeChannel(name : string, id: string, title : string) : IYoutubeChannel {
    return new YoutubeChannel(name, {
        items: [{ 
            id,
            snippet: {
                title
            }
        }]
    });
}

function getUserLayer() : IUserLayer {
    return new UserLayer(new TwitchService(new MockLogger()), new Youtube());
}

async function createUser(twitchID : number, channel : IYoutubeChannel) : Promise<IUser> {
    const user : IUser = new UserModel({
        twitchID,
        youtubeChannel: channel
    });
    return user.save();
} 