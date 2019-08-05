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

NotificationSchema.methods.isDuplicate = function() : Promise<boolean> {
    return Promise.reject(Error("Abstract method can not be called"));
};

export default model<INotification>('Notification', NotificationSchema);