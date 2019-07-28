import SubscribeRequest from './SubscribeRequest';
import UnsubscribeRequest from './UnsubscribeRequest';
import TwitchSubscription from './TwitchSubscription';
import TwitchTopics from "./TwitchTopics";
import ITwitchRequest from "./ITwitchRequest";
import ITwitchResponse from "./ITwitchResponse";
import ITwitchService from "./ITwitchService";
import ILogger from "../../Logging/ILogger";
import StatusCodes from "../../Router/StatusCodes";
import WebhookCallbackURL from '../../DeveloperTools/WebhookCallbackURL';

type PendingTwitchResponse = Promise<ITwitchResponse>;

export default class TwitchService implements ITwitchService {
	private logger : ILogger;

	constructor(logger : ILogger) {
		this.logger = logger;
	}

	public async subscribe(userID : number) : Promise<void> {
		try {
			const callbackURL : string = await WebhookCallbackURL.getCallbackURL("twitch/topic");
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
			const callbackURL : string = await WebhookCallbackURL.getCallbackURL("/twitch/topic");
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
			requests.push(new SubscribeRequest(new TwitchSubscription(userID, topic, callbackURL)));
		}
		return requests;
	}

	private getUnsubscribeRequests(userID: number, callbackURL: string) : SubscribeRequest[] {
		const requests : SubscribeRequest[] = [];
		for (const topic of TwitchTopics) {
			requests.push(new UnsubscribeRequest(new TwitchSubscription(userID, topic, callbackURL)));
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