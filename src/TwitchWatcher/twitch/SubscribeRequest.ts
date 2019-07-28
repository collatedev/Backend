import TwitchRequest from "./TwitchRequest";
import TwitchWebhookRequestBody from "./TwitchWebhookRequestBody";
import ITwitchSubscription from "./ITwitchSubscription";

export default class SubscribeRequest extends TwitchRequest {
	constructor(subscription: ITwitchSubscription) {
		subscription.setMode("subscribe");
		super(new TwitchWebhookRequestBody(subscription));
	}
}