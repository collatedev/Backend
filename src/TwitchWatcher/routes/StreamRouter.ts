import TopicRouter from "./TopicRouter";
import StreamRequestSchema from "../RequestSchemas/StreamRequest.json";
import ILogger from "../../Logging/ILogger";
import ValidationSchema from "../../RequestValidator/ValidationSchema/ValidationSchema";
import StreamBody from "../RequestBody/request/StreamBody";
import IUser from "../../UserService/Models/IUser";
import UserModel from "../../UserService/Models/UserModel";
import StreamStartedModel from "../../Notification/Twitch/Stream/StreamStartedModel";

export default class StreamRouter extends TopicRouter {	
	constructor(logger : ILogger) {
		  super('/streams', new ValidationSchema(StreamRequestSchema), logger);
	}

	protected async handleWebhookData(rawBody: any): Promise<void> {
		this.logger.info(`Stream webhook recieved body: ${JSON.stringify(rawBody)}`);
		const streamData : StreamBody = new StreamBody(rawBody);
		if (streamData.data.length === 0) {
			this.logger.info('Stream stopped notification. This notification is ignored');
			return;
		}
		
		const user : IUser | null = await UserModel.findByTwitchID(streamData.data[0].user_id);
		if (user === null) {
			throw new Error(`Failed to find user with twitch id '${streamData.data[0].user_id}'`);
		}
		await StreamStartedModel.createFromBody(streamData, user).save();
		this.logger.info('Saved stream started noticiation to database');
	}
}