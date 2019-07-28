import FakeSecretGenerator from "./MockSecretGenerator";
import TwitchRequest from "../../src/TwitchWatcher/Twitch/TwitchRequest";
import ITwitchSubscription from "../../src/TwitchWatcher/Twitch/ITwitchSubscription";
import IRequestBuilder from "../../src/TwitchWatcher/RequestBuilder/IRequestBuilder";
import TwitchWebhookRequestBody from "../../src/TwitchWatcher/Twitch/TwitchWebhookRequestBody";

export default class MockTwitchRequest extends TwitchRequest {
	constructor(subscription: ITwitchSubscription, requestBuilder: IRequestBuilder) {
		super(new TwitchWebhookRequestBody(subscription, new FakeSecretGenerator("secret")), requestBuilder);
	}
}