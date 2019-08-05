import TopicRouter from "./TopicRouter";
import UserFollowRequestSchema from "../RequestSchemas/UserFollowRequest.json";
import ILogger from "../../Logging/ILogger";
import ValidationSchema from "../../RequestValidator/ValidationSchema/ValidationSchema";
import FollowBody from "../RequestBody/request/FollowBody";
import UserModel from "../../UserService/Models/UserModel";
import IUser from "../../UserService/Models/IUser";
import FollowModel from "../../Notification/Twitch/Follow/FollowModel";

export default class NewFollowerRouter extends TopicRouter {	
	constructor(logger : ILogger) {
		super('/follow/new', new ValidationSchema(UserFollowRequestSchema), logger);
	}

	protected async handleWebhookData(rawBody: any): Promise<void> {
		this.logger.info(`New Follower webhook recieved body: ${JSON.stringify(rawBody)}`);
		const followData : FollowBody = new FollowBody(rawBody);		
		const user : IUser | null = await UserModel.findByTwitchID(followData.data[0].to_id);
		if (user === null) {
			throw new Error(`Failed to find user with twitch id '${followData.data[0].to_id}'`);
		}
		await FollowModel.createFollowerNotification(followData, user).save();
		this.logger.info('Saved new follower noticiation to database');
	}
}