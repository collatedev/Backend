import ITwitchSubscription from "./ITwitchSubscription";
import TwitchWebhookRequest from "./TwitchWebhookRequest";
import TwitchWebhookRequestBody from "./TwitchWebhookRequestBody";

export default class SubscribeRequest extends TwitchWebhookRequest {
	constructor(subscription: ITwitchSubscription) {
		subscription.setMode("subscribe");
		super(new TwitchWebhookRequestBody(subscription));
	}
}