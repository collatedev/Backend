import FakeSecretGenerator from "./MockSecretGenerator";
import TwitchRequest from "../../src/TwitchWatcher/twitch/TwitchRequest";
import ITwitchSubscription from "../../src/TwitchWatcher/twitch/ITwitchSubscription";
import IRequestBuilder from "../../src/TwitchWatcher/request_builder/IRequestBuilder";
import TwitchWebhookRequestBody from "../../src/TwitchWatcher/twitch/TwitchWebhookRequestBody";

export default class MockTwitchRequest extends TwitchRequest {
	constructor(subscription: ITwitchSubscription, requestBuilder: IRequestBuilder) {
		super(new TwitchWebhookRequestBody(subscription, new FakeSecretGenerator("secret")), requestBuilder);
	}
}