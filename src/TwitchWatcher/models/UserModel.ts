import TwitchUser from "../schemas/user/TwitchUser";
import IUserModel from "./IUserModel";

export default class UserModel implements IUserModel {
    public async getByID(id: number) : Promise<TwitchUser> {
        return new TwitchUser(id); // make request to twitch webhook manager (database and cache)
    }
}