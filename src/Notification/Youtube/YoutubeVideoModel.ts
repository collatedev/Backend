import { Schema } from "mongoose";
import Notification from "../Notification";
import IYoutubeVideo from "./IYoutubeVideo";
import IYoutubeVideoModel from "./IYoutubeVideoModel";

const YoutubeVideoSchema : Schema = new Schema({
    channelID: String,
    datePublished: Date,
    fromUserID: String,
    link: String,
    title: String,
    videoID: String,
}); 

YoutubeVideoSchema.methods.isDuplicate = async function() : Promise<boolean> {
    const currentContext : IYoutubeVideo = this as IYoutubeVideo;
    const results : IYoutubeVideo[] = await currentContext.model('YoutubeCreateVideoNotification').find({
        "videoID": currentContext.videoID
    }).exec() as IYoutubeVideo[];
    if (results.length === 0) {
        return false;
    }
    return results[0].id !== currentContext.id;
};

YoutubeVideoSchema.statics.findByVideoID = async function(
    videoID : string
) : Promise<IYoutubeVideo | null> {
    const currentContext : IYoutubeVideoModel = this as IYoutubeVideoModel;
    return currentContext.findOne({ videoID }).exec();
}; 

export default Notification.discriminator<IYoutubeVideo>(
    'YoutubeCreateVideoNotification', 
    YoutubeVideoSchema
) as IYoutubeVideoModel;