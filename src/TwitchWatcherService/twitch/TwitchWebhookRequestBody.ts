import ITwitchWebhookRequestBody from "./ITwitchWebhookRequestBody";
import * as Path from "path";
import ITwitchRequestBody from "./ITwitchRequestBody";
import AuthorizedTopic from "./AuthorizedTopic";
import ISecretGenerator from "./ISecretGenerator";
import IAuthorizedTopic from "./IAuthorizedTopic";
import ITwitchSubscription from "./ITwitchSubscription";

const SecretSize : number = 16;
const LeaseSeconds : number = 864000; // 10 days in seconds

export default class TwitchWebhookRequestBody implements ITwitchWebhookRequestBody, ITwitchRequestBody {
	public "hub.mode": string;
	public "hub.topic": string;
	public "hub.callback": string;
	public "hub.lease_seconds": number;
	public "hub.secret": string;

	private authorizedTopic : IAuthorizedTopic;
	private secretGenerator: ISecretGenerator;

	constructor(subscription: ITwitchSubscription, secretGenerator : ISecretGenerator) {
		this.authorizedTopic = new AuthorizedTopic(subscription.topic());
		this.secretGenerator = secretGenerator;
		this.setupBodyFields(subscription);
	}

	private setupBodyFields(subscription: ITwitchSubscription) : void {
		this["hub.mode"] = subscription.mode();
		this["hub.lease_seconds"] = LeaseSeconds;
		this["hub.secret"] = this.secretGenerator.generate(SecretSize);
		this["hub.callback"] = Path.join(subscription.callbackURL(), subscription.topic()).replace(':', ':/');
		this["hub.topic"] = this.generateTopicURL(subscription);
	}

	private generateTopicURL(subscription: ITwitchSubscription): string {
		switch(subscription.topic()) {
			case "follow/new":
				return `https://api.twitch.tv/helix/users/follows?first=1&to_id=${subscription.userID()}`;
			case "follow/followed":
				return `https://api.twitch.tv/helix/users/follows?first=1&from_id=${subscription.userID()}`;
			case "user":
				return `https://api.twitch.tv/helix/users?id=${subscription.userID()}`;
			case "streams":
				return `https://api.twitch.tv/helix/streams?user_id=${subscription.userID()}`;
			default:
				throw new Error(`Unknown topic: '${subscription.topic()}'`);
		}
	}

	public requiresAuthorization() : boolean {
		return this.authorizedTopic.isAuthorized();
	}

	public getScope() : string {
		return this.authorizedTopic.scope();
	}

	public getBody() : string {
		return JSON.stringify({
			"hub.mode": this["hub.mode"],
			"hub.topic": this["hub.topic"],
			"hub.secret": this["hub.secret"],
			"hub.callback": this["hub.callback"],
			"hub.lease_seconds": this["hub.lease_seconds"]
		});
	}
}	