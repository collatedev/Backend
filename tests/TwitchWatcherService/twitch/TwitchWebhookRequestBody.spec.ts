import TwitchWebhookRequestBody from "../../../src/TwitchWatcher/Twitch/TwitchWebhookRequestBody";
import TwitchSubscription from "../../../src/TwitchWatcher/Twitch/TwitchSubscription";
import ITwitchWebhookRequestBody from "../../../src/TwitchWatcher/Twitch/ITwitchWebhookRequestBody";
import SecretGenerator from "../../../src/TwitchWatcher/Twitch/SecretGenerator";

beforeEach(() => {
	SecretGenerator.prototype.generate = jest.fn().mockReturnValue("secret");
});

describe("TwitchRequestBody", () => {
	it("Should be legally constructed", () => {
		const body : ITwitchWebhookRequestBody = new TwitchWebhookRequestBody(new TwitchSubscription(1, "streams", "foo"));

		expect(body).not.toBeNull();
	});

	it("Should be illegally constructed", () => {
		expect(() => {
			return new TwitchWebhookRequestBody(
				new TwitchSubscription(1, "illegal", "foo")
			);
		}).toThrow(`Unknown topic: 'illegal'`);
	});

	it("Should be correctly constructed", () => {
		const body : ITwitchWebhookRequestBody = new TwitchWebhookRequestBody(new TwitchSubscription(1, "streams", "foo"));
		const leaseSeconds : number = 300;

		expect(body["hub.callback"]).toEqual("foo/streams");
		expect(body["hub.lease_seconds"]).toEqual(leaseSeconds);
		expect(body["hub.mode"]).toEqual("");
		expect(body["hub.secret"]).toEqual("secret");
		expect(body["hub.topic"]).toEqual("https://api.twitch.tv/helix/streams?user_id=1");
	});
});