import TopicRouter from "./TopicRouter";
import UserFollowRequestSchema from "../api/UserFollowRequest.json";
import ValidationSchema from "../../RequestValidator/ValidationSchema/ValidationSchema";
import ILogger from "../../Logging/ILogger";

export default class UserFollowedRouter extends TopicRouter {	
	constructor(logger : ILogger) {
		super('/follow/followed', new ValidationSchema(UserFollowRequestSchema), logger);
	}

	protected async handleWebhookData(rawBody: any): Promise<void> {
		this.logger.info(`User Followed webhook recieved body: ${JSON.stringify(rawBody)}`);
	}
}