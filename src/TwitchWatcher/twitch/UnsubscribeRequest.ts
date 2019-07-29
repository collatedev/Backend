import TwitchWebhookRequestBody from "./TwitchWebhookRequestBody";
import ITwitchSubscription from "./ITwitchSubscription";
import TwitchWebhookRequest from "./TwitchWebhookRequest";

export default class UnsubscribeRequest extends TwitchWebhookRequest {
	constructor(subscription: ITwitchSubscription) {
		subscription.setMode("unsubscribe");
		super(new TwitchWebhookRequestBody(subscription));
	}
}