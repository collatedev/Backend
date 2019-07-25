import FakeSecretGenerator from "./MockSecretGenerator";
import TwitchRequest from "../../src/TwitchWatcherService/twitch/TwitchRequest";
import ITwitchSubscription from "../../src/TwitchWatcherService/twitch/ITwitchSubscription";
import IRequestBuilder from "../../src/TwitchWatcherService/request_builder/IRequestBuilder";
import TwitchWebhookRequestBody from "../../src/TwitchWatcherService/twitch/TwitchWebhookRequestBody";

export default class MockTwitchRequest extends TwitchRequest {
	constructor(subscription: ITwitchSubscription, requestBuilder: IRequestBuilder) {
		super(new TwitchWebhookRequestBody(subscription, new FakeSecretGenerator("secret")), requestBuilder);
	}
}