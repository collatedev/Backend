import { Model } from "mongoose";
import IStreamStarted from "./IStreamStarted";
import StreamBody from "../../../TwitchWatcher/RequestBody/request/StreamBody";
import IUser from "../../../UserService/Models/IUser";

export default interface IStreamStartedModel extends Model<IStreamStarted> {
    createFromBody(streamBody : StreamBody, user : IUser) : IStreamStarted;
}