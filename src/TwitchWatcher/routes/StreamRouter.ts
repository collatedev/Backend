import TopicRouter from "./TopicRouter";
import StreamRequestSchema from "../api/StreamRequest.json";
import ILogger from "../../Logging/ILogger";
import ValidationSchema from "../../RequestValidator/ValidationSchema/ValidationSchema";

export default class StreamRouter extends TopicRouter {	
	constructor(logger : ILogger) {
		  super('/streams', new ValidationSchema(StreamRequestSchema), logger);
	}

	protected async handleWebhookData(rawBody: any): Promise<void> {
		this.logger.info(`Stream webhook recieved body: ${JSON.stringify(rawBody)}`);
	}
}