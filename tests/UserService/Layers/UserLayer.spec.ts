import IUserLayer from '../../../src/UserService/layers/IUserLayer';
import UserLayer from '../../../src/UserService/layers/UserLayer';
import IUser from '../../../src/UserService/Models/IUser';
import YoutubeChannel from '../../../src/UserService/Models/YoutubeChannel';
import IYoutubeChannel from '../../../src/UserService/Models/IYoutubeChannel';
import MockDB from '../../mocks/MockDB';
import UserModel from '../../../src/UserService/Models/UserModel';
import Youtube from '../../../src/YoutubeWatcher/Youtube/Youtube';
import Twitch from '../../../src/TwitchWatcher/Twitch/Twitch';
import MockLogger from '../../mocks/MockLogger';
import NewUserData from '../../../src/UserService/Layers/NewUserData';
import TwitchUser from '../../../src/UserService/Models/TwitchUser';
import ITwitchUser from '../../../src/UserService/Models/ITwitchUser';
import WebhookInfo from '../../../src/UserService/Models/WebhookInfo';
import Service from '../../../src/UserService/Models/Service';

jest.mock('../../../src/YoutubeWatcher/Youtube/Youtube');
jest.mock('../../../src/TwitchWatcher/Twitch/Twitch');

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
        const twitchUser : ITwitchUser = new TwitchUser(1);
        Youtube.prototype.getChannel = jest.fn().mockReturnValueOnce(Promise.resolve(channel));
        const layer : IUserLayer = getUserLayer();
        const savedUser : IUser = await createUser(twitchUser, channel);

        const user : IUser = await layer.getUserInfo(savedUser.id);

        expect(user.twitchUser).toMatchObject({
            userID: 1
        });
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
        Twitch.prototype.subscribe = jest.fn().mockReturnValueOnce([
            new WebhookInfo(Service.Twitch, "foo", "bar"),
            new WebhookInfo(Service.Twitch, "foo", "bar"),
            new WebhookInfo(Service.Twitch, "foo", "bar"),
            new WebhookInfo(Service.Twitch, "foo", "bar")
        ]);
        const length : number = 5;
        const channel : IYoutubeChannel = createYoutubeChannel("foo", "bar", "baz");
        const twitchUser : ITwitchUser = new TwitchUser(1);
        const layer : IUserLayer = getUserLayer();
        const savedUser : IUser = await createUser(twitchUser, channel);

        const user : IUser = await layer.subscribe(savedUser);

        expect(user.twitchUser).toEqual(twitchUser);
        expect(user.youtubeChannel).toEqual(channel);
        expect(Array.from(user.webhooks)).toHaveLength(length);
    });

    test("Should fail to subscribe to webhooks", async () => {
        const channel : IYoutubeChannel = createYoutubeChannel("foo", "bar", "baz");
        const twitchUser : ITwitchUser = new TwitchUser(1);
        const user : IUser = await createUser(twitchUser, channel);
        Twitch.prototype.subscribe = jest.fn().mockReturnValueOnce(
            Promise.reject(new Error("Subscription failed"))
        );
        const layer : IUserLayer = getUserLayer();

        await expect(layer.subscribe(user)).rejects.toThrow(new Error("Subscription failed"));
    });
});

describe("unsubscribe", () => {
    test("Should unsubscribe to webhooks", async () => {
        const channel : IYoutubeChannel = createYoutubeChannel("foo", "bar", "baz");
        const twitchUser : ITwitchUser = new TwitchUser(1);
        const layer : IUserLayer = getUserLayer();
        const savedUser : IUser = await createUser(twitchUser, channel);

        const user : IUser = await layer.unsubscribe(savedUser);

        expect(user.twitchUser).toEqual(twitchUser);
        expect(user.youtubeChannel).toEqual(channel);
        expect(Array.from(user.webhooks)).toEqual([]);
    });

    test("Should fail to unsubscribe to webhooks", async () => {
        const channel : IYoutubeChannel = createYoutubeChannel("foo", "bar", "baz");
        const twitchUser : ITwitchUser = new TwitchUser(1);
        const savedUser : IUser = await createUser(twitchUser, channel);
        Twitch.prototype.unsubscribe = jest.fn().mockReturnValueOnce(
            Promise.reject(new Error("Subscription failed"))
        );
        const layer : IUserLayer = getUserLayer();

        await expect(layer.unsubscribe(savedUser)).rejects.toThrow(new Error("Subscription failed"));
    });
});

describe("createUser", () => {
    test("successfully create user", async () => {
        const channel : IYoutubeChannel = createYoutubeChannel("foo", "bar", "baz");
        const twitchUser : ITwitchUser = new TwitchUser(1);
        Twitch.prototype.getUser = jest.fn().mockReturnValueOnce(twitchUser);
        Twitch.prototype.subscribe = jest.fn().mockReturnValueOnce([
            new WebhookInfo(Service.Twitch, "foo", "bar"),
            new WebhookInfo(Service.Twitch, "foo", "bar"),
            new WebhookInfo(Service.Twitch, "foo", "bar"),
            new WebhookInfo(Service.Twitch, "foo", "bar")
        ]);
        Youtube.prototype.getChannel = jest.fn().mockReturnValueOnce(channel);
        const layer : IUserLayer = getUserLayer();

        const user : IUser = await layer.createUser(new NewUserData({
            twitchUserName: "foo",
            youtubeChannelName: "foo"
        }));

        expect(user.youtubeChannel).toEqual(channel);
        expect(Array.from(user.webhooks)).toHaveLength(5);
        expect(user.twitchUser).toEqual(twitchUser);
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
    return new UserLayer(new Twitch(new MockLogger()), new Youtube());
}

async function createUser(twitchUser : ITwitchUser, youtubeChannel : IYoutubeChannel) : Promise<IUser> {
    const user : IUser = new UserModel({
        twitchUser,
        youtubeChannel
    });
    return user.save();
} 