import TwitchRequest from "../../src/TwitchWatcher/Twitch/TwitchRequest";
import ITwitchSubscription from "../../src/TwitchWatcher/Twitch/ITwitchSubscription";
import TwitchWebhookRequestBody from "../../src/TwitchWatcher/Twitch/TwitchWebhookRequestBody";

export default class MockTwitchRequest extends TwitchRequest {
	constructor(subscription: ITwitchSubscription) {
		super(new TwitchWebhookRequestBody(subscription));
	}
}