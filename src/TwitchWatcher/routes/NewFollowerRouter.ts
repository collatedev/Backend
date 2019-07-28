import TopicRouter from "./TopicRouter";
import UserFollowRequestSchema from "../RequestSchemas/UserFollowRequest.json";
import ILogger from "../../Logging/ILogger";
import ValidationSchema from "../../RequestValidator/ValidationSchema/ValidationSchema";

export default class NewFollowerRouter extends TopicRouter {	
	constructor(logger : ILogger) {
		super('/follow/new', new ValidationSchema(UserFollowRequestSchema), logger);
	}

	protected async handleWebhookData(rawBody: any): Promise<void> {
		this.logger.info(`New Follower webhook recieved body: ${JSON.stringify(rawBody)}`);
	}
}