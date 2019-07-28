import TwitchRequest from "./TwitchRequest";
import TwitchWebhookRequestBody from "./TwitchWebhookRequestBody";
import ITwitchSubscription from "./ITwitchSubscription";

export default class UnsubscribeRequest extends TwitchRequest {
	constructor(subscription: ITwitchSubscription) {
		subscription.setMode("unsubscribe");
		super(new TwitchWebhookRequestBody(subscription));
	}
}