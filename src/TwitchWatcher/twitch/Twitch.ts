import SubscribeRequest from './SubscribeRequest';
import UnsubscribeRequest from './UnsubscribeRequest';
import TwitchSubscription from './TwitchSubscription';
import TwitchTopics from "./TwitchTopics";
import ITwitchRequest from "./ITwitchRequest";
import ITwitchResponse from "./ITwitchResponse";
import ITwitch from "./ITwitch";
import ILogger from "../../Logging/ILogger";
import StatusCodes from "../../Router/StatusCodes";
import WebhookCallbackURL from '../../DeveloperTools/WebhookCallbackURL';
import ITwitchUser from '../../UserService/Models/ITwitchUser';
import GetUserRequest from './GetUserRequest';
import TwitchUser from '../../UserService/Models/TwitchUser';
import IWebhookInfo from '../../UserService/Models/IWebhookInfo';
import ITwitchWebhookRequest from './ITwitchWebhookRequest';

type PendingTwitchResponse = Promise<ITwitchResponse>;

export default class Twitch implements ITwitch {
	private logger : ILogger;

	constructor(logger : ILogger) {
		this.logger = logger;
	}

	public async getUser(userName : string) : Promise<ITwitchUser> {
		const getUserRequest : ITwitchRequest = new GetUserRequest(userName);
		const response : ITwitchResponse = await getUserRequest.send();
		const payload : any = await response.response().json();
		if (payload.data.length === 0) {
			throw new Error(`Could not find user with login "${userName}"`);
		}
		return new TwitchUser(payload.data[0].id);
	}

	public async subscribe(user : ITwitchUser) : Promise<IWebhookInfo[]> {
		try {
			const callbackURL : string = await WebhookCallbackURL.getCallbackURL("twitch/topic");
			const requests : ITwitchWebhookRequest[] = this.getSubscribeRequests(user.userID, callbackURL);
			await this.makeWebhookRequests(requests);
			this.logger.info(
				`Successfully completed Twich subscription requests to all topics for user (id=${user}) to all webhooks`
			);	
			return this.getWebhooks(requests);
		} catch (error) {
			throw error;
		}
	}

	public async unsubscribe(user: ITwitchUser) : Promise<IWebhookInfo[]> {
		try {
			const callbackURL : string = await WebhookCallbackURL.getCallbackURL("/twitch/topic");
			const requests : ITwitchWebhookRequest[] = this.getUnsubscribeRequests(user.userID, callbackURL);
			await this.makeWebhookRequests(requests);
			this.logger.info(
				`Successfully completed Twich subscription requests to all topics for user (id=${user}) to all webhooks`
			);
			return this.getWebhooks(requests);
		} catch (error) {
			throw error;
		}
	}

	private getSubscribeRequests(userID: number, callbackURL: string) : ITwitchWebhookRequest[] {
		const requests : SubscribeRequest[] = [];
		for (const topic of TwitchTopics) {
			requests.push(new SubscribeRequest(new TwitchSubscription(userID, topic, callbackURL)));
		}
		return requests;
	}

	private getUnsubscribeRequests(userID: number, callbackURL: string) : ITwitchWebhookRequest[] {
		const requests : UnsubscribeRequest[] = [];
		for (const topic of TwitchTopics) {
			requests.push(new UnsubscribeRequest(new TwitchSubscription(userID, topic, callbackURL)));
		}
		return requests;
	}


	private async makeWebhookRequests(requests: ITwitchRequest[]) : Promise<void> {
		const messages : PendingTwitchResponse[] = this.sendWebhookRequests(requests);	
		const responses : ITwitchResponse[] = await Promise.all(messages);
		this.validateWebhookResponses(responses);
	}

	private validateWebhookResponses(responses: ITwitchResponse[]) : void {
		for (const response of responses) {
			if (response.response().status !== StatusCodes.Accepted) {
				throw new Error(`Failed to subscribe to ${response.request().body}`);
			}
		}
	}

	private sendWebhookRequests(requests: ITwitchRequest[]) : PendingTwitchResponse[] {
		const messages : PendingTwitchResponse[] = [];
		for (const request of requests) {
			messages.push(request.send());
		}
		return messages;
	}

	private getWebhooks(requests : ITwitchWebhookRequest[]) : IWebhookInfo[] {
		const webhooks : IWebhookInfo[] = [];
		for (const request of requests) {
			webhooks.push(request.getWebhook());
		}
		return webhooks;
	}
}