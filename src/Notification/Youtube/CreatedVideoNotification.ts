import { Schema } from "mongoose";
import Notification from "../Notification";
import ICreatedVideoNotification from "./ICreatedVideoNotification";
import ICreatedVideoModel from "./ICreatedVideoModel";

const YoutubeVideoSchema : Schema = new Schema({
    channelID: String,
    datePublished: Date,
    fromUserID: String,
    link: String,
    title: String,
    videoID: String,
}); 

YoutubeVideoSchema.methods.isDuplicate = async function() : Promise<boolean> {
    const currentContext : ICreatedVideoNotification = this as ICreatedVideoNotification;
    const results : ICreatedVideoNotification[] = await currentContext.model('YoutubeCreateVideoNotification').find({
        "videoID": currentContext.videoID
    }).exec() as ICreatedVideoNotification[];
    if (results.length === 0) {
        return false;
    }
    return results[0].id !== currentContext.id;
};

YoutubeVideoSchema.statics.findByVideoID = async function(
    videoID : string
) : Promise<ICreatedVideoNotification | null> {
    const currentContext : ICreatedVideoModel = this as ICreatedVideoModel;
    return currentContext.findOne({ videoID }).exec();
}; 

export default Notification.discriminator<ICreatedVideoNotification>(
    'YoutubeCreateVideoNotification', 
    YoutubeVideoSchema
) as ICreatedVideoModel;