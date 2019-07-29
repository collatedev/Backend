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

jest.mock('../../../src/UserService/Models/YoutubeChannel');
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
        const savedUser : IUser = await createUser(1, channel);
        const layer : IUserLayer = getUserLayer();

        const user : IUser = await layer.getUserInfo(savedUser._id);

        expect(user.toJSON()).toEqual(savedUser.toJSON());
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