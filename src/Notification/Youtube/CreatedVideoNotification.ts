import { Schema } from "mongoose";
import Notification from "../Notification";
import ICreatedVideoNotification from "./ICreatedVideoNotification";

const CreateVideoNotificationSchema : Schema = new Schema({
    channelID: String,
    datePublished: Date,
    fromUserID: String,
    link: String,
    title: String,
    videoID: String,
}); 

CreateVideoNotificationSchema.methods.isDuplicate = async function() : Promise<boolean> {
    const currentContext : ICreatedVideoNotification = this as ICreatedVideoNotification;
    const results : ICreatedVideoNotification[] = await currentContext.model('YoutubeCreateVideoNotification').find({
        "videoID": currentContext.videoID
    }).exec() as ICreatedVideoNotification[];
    if (results.length === 0) {
        return false;
    }
    return results[0].id !== currentContext.id;
};

export default Notification.discriminator<ICreatedVideoNotification>(
    'YoutubeCreateVideoNotification', 
    CreateVideoNotificationSchema
);