import { Model } from "mongoose";
import IYoutubeVideo from "./IYoutubeVideo";

export default interface IYoutubeVideoModel extends Model<IYoutubeVideo> {
    findByVideoID(videoID : string) : Promise<IYoutubeVideo | null>;
}