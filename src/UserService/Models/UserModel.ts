import mongoose, { Schema } from "mongoose";
import IUser from "./IUser";
import ITwitchUser from "./ITwitchUser";
import TwitchUser from "./TwitchUser";

const UserSchema : Schema = new Schema({
    twitchID: Number,
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

UserSchema.methods.getTwitchUser = function() : ITwitchUser {
    return new TwitchUser(this.twitchID);
};

export default mongoose.model<IUser>('User', UserSchema);