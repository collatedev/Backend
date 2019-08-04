import { Model } from "mongoose";
import IYoutubeVideo from "./IYoutubeVideo";

export default interface ICreatedVideoModel extends Model<IYoutubeVideo> {
    findByVideoID(videoID : string) : Promise<IYoutubeVideo | null>;
}