import IFollow from "./IFollow";
import { Model } from "mongoose";
import FollowBody from "../../../TwitchWatcher/RequestBody/request/FollowBody";
import IUser from "../../../UserService/Models/IUser";

export default interface IFollowModel extends Model<IFollow> {
    createFollowedNotification(followBody : FollowBody, user : IUser) : IFollow;
    createFollowerNotification(followBody : FollowBody, user : IUser) : IFollow;
}