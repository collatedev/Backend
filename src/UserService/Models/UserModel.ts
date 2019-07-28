import IUserModel from "./IUserModel";
import IUser from "./IUser";
import User from "./User";
import IYoutubeChannel from "./IYoutubeChannel";
import YoutubeChannel from "./YoutubeChannel";

const twitchTestID : number = 56682227;
const youtubeChannelTestID : string = "UCJU7oHhmt-EUa8KNfpuvDhA";

export default class UserModel implements IUserModel {
    public async getByID(id: number) : Promise<IUser> {
        return new User(id, twitchTestID, new YoutubeChannel("test", {
            items: { id : youtubeChannelTestID }
        }));
    }

    public async create(twitchID : number, channel : IYoutubeChannel) : Promise<IUser> {
        return new User(1, twitchID, channel);
    }

    public async delete(id : number) : Promise<IUser> {
        return new User(id, twitchTestID, new YoutubeChannel("test", {
            items: { id : youtubeChannelTestID }
        }));
    }
}