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

export default Notification.discriminator<ICreatedVideoNotification>(
    'YoutubeCreateVideoNotification', 
    CreateVideoNotificationSchema
);