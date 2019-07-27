import { Request, Response } from "express";
import ChallengeQuery from "../RequestBody/request/ChallengeQuery";
import WebhookChallengeRequestSchema from "../../RequestSchemas/WebhookChallengeRequest.json";
import ITopicRouter from "./ITopicRouter";
import IValidationSchema from "../../RequestValidator/ValidationSchema/IValidationSchema";
import ILogger from "../../Logging/ILogger";
import StatusCodes from "../../Router/StatusCodes";
import ValidationSchema from "../../RequestValidator/ValidationSchema/ValidationSchema";
import Router from "../../Router/Router";

export default abstract class TopicRouter extends Router implements ITopicRouter {
	private topic : string;
	private readonly schema : IValidationSchema;
	private readonly challengeSchema : IValidationSchema;

    constructor(topic: string, schema : IValidationSchema, logger : ILogger) {
		super(`/twitch/topic`, logger);
		this.schema = schema;
		this.challengeSchema = new ValidationSchema(WebhookChallengeRequestSchema);
        this.topic = topic;
        this.handleChallenge = this.handleChallenge.bind(this);
        this.handleWebhookCall = this.handleWebhookCall.bind(this);
    }

    public setup() : void {
        this.get(this.topic, this.handleChallenge, this.challengeSchema);
        this.post(this.topic, this.handleWebhookCall, this.schema);
    }

    public async handleChallenge(request: Request, response: Response) : Promise<void> {
		response.status(StatusCodes.OK).send(new ChallengeQuery(request.query)["hub.challenge"]);
	}
    
    public async handleWebhookCall(request: Request, response: Response) : Promise<void> {
        try {
			await this.handleWebhookData(request.body);
			this.logger.info(`Successfuly processed webhook at topic: '${this.topic}'`);
			this.sendData(response, {
				desc: `Recieved data under topic: ${this.topic}`,
				body: request.body,
				processedData: true,
			}, StatusCodes.OK);
		} catch (error) {
			this.logger.error(error);
			this.sendError(response, "Failed to process webhook data", StatusCodes.InternalError);
		}
	}

    protected abstract async handleWebhookData(rawBody: any): Promise<void>;
}