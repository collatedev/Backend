import { Schema, model } from "mongoose";
import INotification from "./INotification";

const NotificationSchema : Schema = new Schema({
    type: String,
    fromUserID: String,
    createdAt: {
        type: Date,
        default: new Date()
    }
});

export default model<INotification>('Notification', NotificationSchema);