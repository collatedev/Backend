import { Schema } from "mongoose";
import Notification from "../../Notification";
import IStreamStarted from "./IStreamStarted";
import IStreamStartedModel from "./IStreamStartedModel";
import StreamBody from "../../../TwitchWatcher/RequestBody/request/StreamBody";
import IUser from "../../../UserService/Models/IUser";
import NotificationType from "../../NotificationType";

const StreamStartedModel : Schema = new Schema({
    streamID: Number,
	userID: String,
	twitchUserName: String,
	gameID: Number,
	communityIDs: [Number],
	streamType: String,
	title: String,
	viewerCount: Number,
	startedAt: Date,
	language: String,
	thumbnailURL: String
});

StreamStartedModel.statics.createFromBody = function(streamBody :StreamBody, user : IUser) : IStreamStarted {
	const currentContext : IStreamStartedModel = this;
	return new currentContext({
		streamID: streamBody.data[0].id,
		userID: user.id,
		twitchUserName: streamBody.data[0].user_name,
		gameID: streamBody.data[0].game_id,
		communityIDs: streamBody.data[0].community_ids,
		type: NotificationType.Twitch.StreamStarted,
		streamType: streamBody.data[0].type,
		title: streamBody.data[0].title,
		viewerCount: streamBody.data[0].viewer_count,
		startedAt: new Date(streamBody.data[0].started_at),
		language: streamBody.data[0].language,
		thumbnailURL: streamBody.data[0].thumbnail_url
	});
};

export default Notification.discriminator<IStreamStarted>(
    'StreamStarted',
    StreamStartedModel
) as IStreamStartedModel;