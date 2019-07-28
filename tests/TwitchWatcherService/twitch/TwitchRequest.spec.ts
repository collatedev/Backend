import MockSecretGenerator from "../../mocks/MockSecretGenerator";
import { Response, Headers } from "node-fetch";
import ITwitchSubscription from "../../../src/TwitchWatcher/Twitch/ITwitchSubscription";
import TwitchSubscription from "../../../src/TwitchWatcher/Twitch/TwitchSubscription";
import TwitchWebhookRequestBody from "../../../src/TwitchWatcher/Twitch/TwitchWebhookRequestBody";
import MockTwitchRequest from "../../mocks/MockTwitchRequest";
import ITwitchRequest from "../../../src/TwitchWatcher/Twitch/ITwitchRequest";
import MockFetchRequestBuilder from "../../mocks/MockFetchRequestBuilder";
import TwitchResponse from "../../../src/TwitchWatcher/Twitch/TwitchResponse";

describe('send()', () => {
	test('Should fail to get OAuth token for the request', async () => {
		const subscription : ITwitchSubscription = new TwitchSubscription(1, "user", "foo");
		const builder : MockFetchRequestBuilder = new MockFetchRequestBuilder();
		const request : ITwitchRequest = new MockTwitchRequest(subscription, builder);
		
		await expect(request.send()).rejects.toEqual(new Error("Request Failed"));
	});

	test('Should fail to get OAuth token for the request due to error with request', async () => {
		const subscription : ITwitchSubscription = new TwitchSubscription(1, "user", "foo");
		const builder : MockFetchRequestBuilder = new MockFetchRequestBuilder();
		const request : ITwitchRequest = new MockTwitchRequest(subscription, builder);

		builder.queueResponse(new Response(JSON.stringify({
			error: "error",
			message: "message",
			status: 400
		}), {
			status: 400
		}));

		await expect(request.send()).rejects.toEqual(new Error("[error]: message"));
	});

	test('Should successfully send authorized request', async () => {
		const subscription : ITwitchSubscription = new TwitchSubscription(1, "user", "foo");
		const builder : MockFetchRequestBuilder = new MockFetchRequestBuilder();
		const request : ITwitchRequest = new MockTwitchRequest(subscription, builder);

		queueBearerResponse(builder);
		builder.queueResponse(new Response("", {
			status: 202
		}));

		const clientID : string | undefined = process.env.TWITCH_CLIENT_ID;
		await expect(request.send()).resolves.toEqual(new TwitchResponse({
			headers: new Headers({
				"Client-ID": clientID === undefined ? "" : clientID,
				"Content-Type": "application/json",
				"Authorization": 'Bearer asdfasdf'
			}),
			body: new TwitchWebhookRequestBody(subscription, new MockSecretGenerator("secret")).getBody(),
			method: "POST"
		}, new Response("", {
			status: 202
		})));
	});

	test('Should successfully send unauthorized request', async () => {
		const subscription : ITwitchSubscription = new TwitchSubscription(1, "streams", "foo");
		const builder : MockFetchRequestBuilder = new MockFetchRequestBuilder();
		const request : ITwitchRequest = new MockTwitchRequest(subscription, builder);

		builder.queueResponse(new Response("", {
			status: 202
		}));
		
		const clientID : string | undefined = process.env.TWITCH_CLIENT_ID;
		await expect(request.send()).resolves.toEqual(new TwitchResponse({
			headers: new Headers({
				"Client-ID": clientID === undefined ? "" : clientID,
				"Content-Type": "application/json",
			}),
			body: new TwitchWebhookRequestBody(subscription, new MockSecretGenerator("secret")).getBody(),
			method: "POST"
		}, new Response("", {
			status: 202
		})));
	});
});

function queueBearerResponse(builder: MockFetchRequestBuilder) : void {
	builder.queueResponse(new Response(getAuthorizationBearer(), {
		status: 200
	}));
}

function getAuthorizationBearer(): string {
	return JSON.stringify({
		access_token: "asdfasdf",
		refresh_token: null,
		scope: ["user_read_email"]
	});
}