import mongoose, { Schema } from "mongoose";
import IUser from "./IUser";
import IWebhookInfo from "./IWebhookInfo";

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

UserSchema.methods.addWebhook = async function(webhook : IWebhookInfo) : Promise<void> {
    const currentContext : IUser = this as IUser;
    currentContext.webhooks.push(webhook);
    await currentContext.model('User').findByIdAndUpdate(currentContext.id, {
        $set: {
            webhooks: currentContext.webhooks
        }
    }).exec();
};

export default mongoose.model<IUser>('User', UserSchema);