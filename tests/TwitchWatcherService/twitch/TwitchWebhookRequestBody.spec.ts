import TwitchWebhookRequestBody from "../../../src/TwitchWatcher/twitch/TwitchWebhookRequestBody";
import TwitchSubscription from "../../../src/TwitchWatcher/twitch/TwitchSubscription";
import ITwitchWebhookRequestBody from "../../../src/TwitchWatcher/twitch/ITwitchWebhookRequestBody";
import MockSecretGenerator from "../../mocks/MockSecretGenerator";

describe("TwitchRequestBody", () => {
	it("Should be legally constructed", () => {
		const body : ITwitchWebhookRequestBody = new TwitchWebhookRequestBody(
			new TwitchSubscription({
				userID: 1
			}, "streams", "foo"),
			new MockSecretGenerator("secret")
		);

		expect(body).not.toBeNull();
	});

	it("Should be illegally constructed", () => {
		expect(() => {
			return new TwitchWebhookRequestBody(
				new TwitchSubscription({
					userID: 1
				}, "illegal", "foo"),
				new MockSecretGenerator("secret")
			);
		}).toThrow(`Unknown topic: 'illegal'`);
	});
});