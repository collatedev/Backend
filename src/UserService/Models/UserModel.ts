import mongoose, { Schema } from "mongoose";
import IUser from "./IUser";

const UserSchema : Schema = new Schema({
    twitchUser: {
        userID: Number
    },
    youtubeChannel: {
        channelName: String,
        youtubeID: String,
        title: String
    },
    webhooks: {
        type: [{
            expirationDate: Date,
            topicURL: String,
            callbackURL: String,
            service: String
        }],
        default: []
    }
});

export default mongoose.model<IUser>('User', UserSchema);