import MockBody from "./MockBody";
import MockLogger from "./MockLogger";
import ILogger from "../../src/Logging/ILogger";
import IValidationSchema from "../../src/RequestValidator/ValidationSchema/IValidationSchema";
import TopicRouter from "../../src/TwitchWatcher/routes/TopicRouter";

const logger : ILogger = new MockLogger();

export default class MockTopicRouter extends TopicRouter {    
    private shouldFail: boolean;

    constructor(schema : IValidationSchema) {
		super('/test', schema, logger);
		this.shouldFail = false;
    }

    public failNextRequest() : void {
        this.shouldFail = true;
	}
	
	protected getBody(body: any) : MockBody {
		return new MockBody(body);
	}

    protected async handleWebhookData(rawBody: any): Promise<void> {
        if (this.shouldFail) {
            throw new Error('Failed to process data');
        }
        this.shouldFail = false;
    }
}