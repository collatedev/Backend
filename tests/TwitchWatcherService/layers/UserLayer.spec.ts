import FakeUserModel from '../../mocks/MockUserModel';
import MockTwitchService from '../../mocks/MockTwitchService';
import IUserLayer from '../../../src/TwitchWatcherService/layers/IUserLayer';
import UserLayer from '../../../src/TwitchWatcherService/layers/UserLayer';
import TwitchUser from '../../../src/TwitchWatcherService/schemas/user/TwitchUser';

describe('getUserInfo', () => {
    it('Should get a user with id 1', async () => {
        const userModel : FakeUserModel = new FakeUserModel();
        userModel.addUser(1);
        const layer : IUserLayer = new UserLayer(userModel, new MockTwitchService());
        
        const user : TwitchUser = await layer.getUserInfo(1);

        expect(user.id).toEqual(1);
    });
});