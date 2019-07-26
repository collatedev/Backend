import TwitchRequest from "./TwitchRequest";
import TwitchWebhookRequestBody from "./TwitchWebhookRequestBody";
import IRequestBuilder from "../request_builder/IRequestBuilder";
import ISecretGenerator from "./ISecretGenerator";
import ITwitchSubscription from "./ITwitchSubscription";

export default class UnsubscribeRequest extends TwitchRequest {
	constructor(subscription: ITwitchSubscription, requestBuilder: IRequestBuilder, secretGenerator : ISecretGenerator) {
		subscription.setMode("unsubscribe");
		super(new TwitchWebhookRequestBody(subscription, secretGenerator), requestBuilder);
	}
}