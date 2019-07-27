import TwitchRequest from "./TwitchRequest";
import TwitchWebhookRequestBody from "./TwitchWebhookRequestBody";
import IRequestBuilder from "../RequestBuilder/IRequestBuilder";
import ISecretGenerator from "./ISecretGenerator";
import ITwitchSubscription from "./ITwitchSubscription";

export default class SubscribeRequest extends TwitchRequest {
	constructor(subscription: ITwitchSubscription, requestBuilder: IRequestBuilder, secretGenerator : ISecretGenerator) {
		subscription.setMode("subscribe");
		super(new TwitchWebhookRequestBody(subscription, secretGenerator), requestBuilder);
	}
}