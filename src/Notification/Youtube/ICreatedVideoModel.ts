import { Model } from "mongoose";
import ICreatedVideoNotification from "./ICreatedVideoNotification";

export default interface ICreatedVideoModel extends Model<ICreatedVideoNotification> {
    findByVideoID(videoID : string) : Promise<ICreatedVideoNotification | null>;
}