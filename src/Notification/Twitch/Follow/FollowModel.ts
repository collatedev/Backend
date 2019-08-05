import { Schema } from "mongoose";
import Notification from "../../Notification";
import IFollow from "./IFollow";
import IFollowModel from "./IFollowModel";
import FollowBody from "../../../TwitchWatcher/RequestBody/request/FollowBody";
import IUser from "../../../UserService/Models/IUser";

const FollowModel : Schema = new Schema({
    fromID: String,
    fromTwitchID: Number,
    fromName: String,
    toID: String,
    toTwitchID: Number,
    toName: String,
    followedAt: Date
});

FollowModel.statics.createFollowedNotification = function(body : FollowBody, user : IUser) : IFollow {
    const currentContext : IFollowModel = this;
    return new currentContext({
        fromID: user.id,
        fromTwitchID: body.data[0].from_id,
        fromName: body.data[0].from_name,
        toID: null,
        toTwitchID: body.data[0].to_id,
        toName: body.data[0].to_name,
        followedAt: new Date(body.data[0].followed_at)
    });
};

FollowModel.statics.createFollowerNotification = function(body : FollowBody, user : IUser) : IFollow {
    const currentContext : IFollowModel = this;
    return new currentContext({
        fromID: null,
        fromTwitchID: body.data[0].from_id,
        fromName: body.data[0].from_name,
        toID: user.id,
        toTwitchID: body.data[0].to_id,
        toName: body.data[0].to_name,
        followedAt: new Date(body.data[0].followed_at)
    });
};

export default Notification.discriminator<IFollow>(
    'TwitchUserFollowed',
    FollowModel
) as IFollowModel;