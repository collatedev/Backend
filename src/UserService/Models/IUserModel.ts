import { Model } from "mongoose";
import IUser from "./IUser";

export default interface IUserModel extends Model<IUser> {
    findByYoutubeID(channelID : string) : Promise<IUser | null>;
    findByTwitchID(channelID : number) : Promise<IUser | null>;
}