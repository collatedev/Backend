import mongoose, { Schema } from "mongoose";
import IUser from "./IUser";
import IUserModel from "./IUserModel";
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

UserSchema.statics.findByYoutubeID = async function(channelID : string) : Promise<IUser | null> {
    const currentContext : IUserModel = this as IUserModel;
    return currentContext.findOne({
        "youtubeChannel.youtubeID": channelID
    }).exec();
};

UserSchema.statics.findByTwitchID = async function(channelID : number) : Promise<IUser | null> {
    const currentContext : IUserModel = this as IUserModel;
    return currentContext.findOne({
        "twitchUser.userID": channelID
    }).exec();
};

export default mongoose.model<IUser>('User', UserSchema) as IUserModel;