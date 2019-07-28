import MockLogger from "./MockLogger";
import IValidationSchema from "../../src/RequestValidator/ValidationSchema/IValidationSchema";
import TopicRouter from "../../src/TwitchWatcher/Routes/TopicRouter";

export default class MockTopicRouter extends TopicRouter {    
	constructor(schema : IValidationSchema) {
		super('/test', schema, new MockLogger());
	}
	
	public async handleWebhookData(rawBody: any): Promise<void> {
		return;
	}
}