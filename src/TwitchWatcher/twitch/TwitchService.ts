import SubscribeRequest from './SubscribeRequest';
import UnsubscribeRequest from './UnsubscribeRequest';
import TwitchSubscription from './TwitchSubscription';
import FetchRequestBuilder from '../RequestBuilder/FetchRequestBuilder';
import IRequestBuilder from "../RequestBuilder/IRequestBuilder";
import TwitchTopics from "./TwitchTopics";
import TwitchCallbackURL from "./TwitchCallbackURL";
import ISecretGenerator from "./ISecretGenerator";
import ITwitchRequest from "./ITwitchRequest";
import ITwitchResponse from "./ITwitchResponse";
import ITwitchService from "./ITwitchService";
import ILogger from "../../Logging/ILogger";
import StatusCodes from "../../Router/StatusCodes";

type PendingTwitchResponse = Promise<ITwitchResponse>;

export default class TwitchService implements ITwitchService {
	private requestBuilder : IRequestBuilder = new FetchRequestBuilder();
	private logger : ILogger;
	private secretGenerator : ISecretGenerator;

	constructor(requestBuilder : IRequestBuilder, secretGenerator : ISecretGenerator, logger : ILogger) {
		this.requestBuilder = requestBuilder;
		this.logger = logger;
		this.secretGenerator = secretGenerator;
	}

	public async subscribe(userID : number) : Promise<void> {
		try {
			const callbackURL : string = await TwitchCallbackURL.getCallbackURL();
			const requests : SubscribeRequest[] = this.getSubscribeRequests(userID, callbackURL);
			await this.makeRequests(requests);
			this.logger.info(
				`Successfully completed Twich subscription requests to all topics for user (id=${userID}) to all webhooks`
			);	
		} catch (error) {
			throw error;
		}
	}

	public async unsubscribe(userID: number) : Promise<void> {
		try {
			const callbackURL : string = await TwitchCallbackURL.getCallbackURL();
			const requests : UnsubscribeRequest[] = this.getUnsubscribeRequests(userID, callbackURL);
			await this.makeRequests(requests);
			this.logger.info(
				`Successfully completed Twich subscription requests to all topics for user (id=${userID}) to all webhooks`
			);	
		} catch (error) {
			throw error;
		}
	}

	private getSubscribeRequests(userID: number, callbackURL: string) : SubscribeRequest[] {
		const requests : SubscribeRequest[] = [];
		for (const topic of TwitchTopics) {
			requests.push(new SubscribeRequest(
				new TwitchSubscription(userID, topic, callbackURL), 
				this.requestBuilder,
				this.secretGenerator
			));
		}
		return requests;
	}

	private getUnsubscribeRequests(userID: number, callbackURL: string) : SubscribeRequest[] {
		const requests : SubscribeRequest[] = [];
		for (const topic of TwitchTopics) {
			requests.push(new UnsubscribeRequest(
				new TwitchSubscription(userID, topic, callbackURL), 
				this.requestBuilder,
				this.secretGenerator
			));
		}
		return requests;
	}


	private async makeRequests(requests: ITwitchRequest[]) : Promise<void> {
		const messages : PendingTwitchResponse[] = this.sendRequests(requests);	
		const responses : ITwitchResponse[] = await Promise.all(messages);
		this.validateResponses(responses);
	}

	private validateResponses(responses: ITwitchResponse[]) : void {
		for (const response of responses) {
			if (response.response().status !== StatusCodes.Accepted) {
				throw new Error(`Failed to subscribe to ${response.request().body}`);
			}
		}
	}

	private sendRequests(requests: ITwitchRequest[]) : PendingTwitchResponse[] {
		const messages : PendingTwitchResponse[] = [];
		for (const request of requests) {
			messages.push(request.send());
		}
		return messages;
	}
}