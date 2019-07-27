import IUserModel from "./IUserModel";
import IUser from "./IUser";
import User from "./User";
import INewUserData from "../Layers/INewUserData";
import NewUserData from "../Layers/NewUserData";

const twitchTestID : number = 56682227;
const youtubeChannelTestID : string = "UCJU7oHhmt-EUa8KNfpuvDhA";

export default class UserModel implements IUserModel {
    public async getByID(id: number) : Promise<IUser> {
        return new User(new NewUserData({
            twitchUserID: twitchTestID,
            youtubeChannelID : youtubeChannelTestID
        }), id);
    }

    public async create(newUserData : INewUserData) : Promise<IUser> {
        return new User(newUserData, 1);
    }

    public async delete(id : number) : Promise<IUser> {
        return new User(new NewUserData({
            twitchUserID: twitchTestID,
            youtubeChannelID : youtubeChannelTestID
        }), id);
    }
}