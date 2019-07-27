import FakeUserModel from '../../mocks/MockUserModel';
import MockTwitchService from '../../mocks/MockTwitchService';
import IUserLayer from '../../../src/UserService/layers/IUserLayer';
import UserLayer from '../../../src/UserService/layers/UserLayer';
import NewUserData from '../../../src/UserService/Layers/NewUserData';
import IUser from '../../../src/UserService/models/IUser';
import TwitchUser from '../../../src/UserService/Models/TwitchUser';
import YoutubeChannel from '../../../src/UserService/Models/YoutubeChannel';

describe('getUserInfo', () => {
    it('Should get a user with id 1', async () => {
        const userModel : FakeUserModel = new FakeUserModel();
        userModel.create(new NewUserData({
            twitchUserID: 1,
            youtubeChannelID: "foo"
        }));
        const layer : IUserLayer = new UserLayer(userModel, new MockTwitchService());
        
        const user : IUser = await layer.getUserInfo(0);

        expect(user.getID()).toEqual(0);
        expect(user.getTwitchUser()).toEqual(new TwitchUser(1));
        expect(user.getYoutubeChannel()).toEqual(new YoutubeChannel("foo"));
    });
});