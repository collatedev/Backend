import TopicRouter from "./TopicRouter";
import TwitchProfileUpdateRequestSchema from "../api/TwitchProfileUpdateRequest.json";
import ILogger from "../../Logging/ILogger";
import ValidationSchema from "../../RequestValidator/ValidationSchema/ValidationSchema";

export default class TwitchProfileUpdateRouter extends TopicRouter {	
	constructor(logger : ILogger) {
		super('/user', new ValidationSchema(TwitchProfileUpdateRequestSchema), logger);
	}

	protected async handleWebhookData(rawBody: any): Promise<void> {
	  	this.logger.info(`Twitch Profile Update webhook recieved body: ${JSON.stringify(rawBody)}`);
	}
}