import { Response, Headers } from "node-fetch";
import ITwitchSubscription from "../../../src/TwitchWatcher/Twitch/ITwitchSubscription";
import TwitchSubscription from "../../../src/TwitchWatcher/Twitch/TwitchSubscription";
import TwitchWebhookRequestBody from "../../../src/TwitchWatcher/Twitch/TwitchWebhookRequestBody";
import MockTwitchRequest from "../../mocks/MockTwitchRequest";
import ITwitchRequest from "../../../src/TwitchWatcher/Twitch/ITwitchRequest";
import TwitchResponse from "../../../src/TwitchWatcher/Twitch/TwitchResponse";
import SecretGenerator from "../../../src/TwitchWatcher/Twitch/SecretGenerator";
import FetchRequestBuilder from "../../../src/HTTPRequestBuilder/FetchRequestBuilder";
import StatusCodes from "../../../src/Router/StatusCodes";
import ITwitchResponse from "../../../src/TwitchWatcher/Twitch/ITwitchResponse";

const OLD_ENV : any = process.env;

	beforeEach(() => {
		jest.resetModules(); // this is important - it clears the cache
		process.env = { ...OLD_ENV };
		SecretGenerator.prototype.generate = jest.fn().mockReturnValue("secret");
		delete process.env.NODE_ENV;
	});

	afterEach(() => {
		process.env = OLD_ENV;
	});

describe('send()', () => {
	test('Should fail to get OAuth token for the request', async () => {
		FetchRequestBuilder.prototype.makeRequest = jest.fn().mockReturnValueOnce(getErrorResponse());
		const subscription : ITwitchSubscription = new TwitchSubscription(1, "user", "foo");
		const request : ITwitchRequest = new MockTwitchRequest(subscription);
		
		await expect(request.send()).rejects.toEqual(new Error("Request failed"));
	});

	test('Should fail to get OAuth token for the request due to error with request', async () => {
		FetchRequestBuilder.prototype.makeRequest = jest.fn().mockReturnValueOnce(getOAuthErrorResponse());
		const subscription : ITwitchSubscription = new TwitchSubscription(1, "user", "foo");
		const request : ITwitchRequest = new MockTwitchRequest(subscription);

		await expect(request.send()).rejects.toEqual(new Error("[error]: message"));
	});

	test('Should successfully send authorized request', async () => {
		process.env.TWITCH_CLIENT_ID = "test-client";
		FetchRequestBuilder.prototype.makeRequest = jest.fn()
			.mockReturnValueOnce(getBearerResponse())
			.mockReturnValueOnce(getVerificationResponse(StatusCodes.Accepted));

		const subscription : ITwitchSubscription = new TwitchSubscription(1, "user", "foo");
		const request : ITwitchRequest = new MockTwitchRequest(subscription);

		await expect(request.send()).resolves.toEqual(getTwitchResponse(subscription, true));
	});

	test('Should successfully send unauthorized request', async () => {
		process.env.TWITCH_CLIENT_ID = "test-client";
		FetchRequestBuilder.prototype.makeRequest = jest.fn()
			.mockReturnValueOnce(getVerificationResponse(StatusCodes.Accepted));

		const subscription : ITwitchSubscription = new TwitchSubscription(1, "streams", "foo");
		const request : ITwitchRequest = new MockTwitchRequest(subscription);

		await expect(request.send()).resolves.toEqual(getTwitchResponse(subscription, false));
	});
});

function getErrorResponse() : Promise<Response> {
	return Promise.reject(new Error("Request failed"));
}

function getOAuthErrorResponse() : Promise<Response> {
	return Promise.resolve(new Response(JSON.stringify({
		error: "error",
		message: "message",
		status: 400
	}), {
		status: 400
	}));
}

function getBearerResponse() : Promise<Response> {
	return Promise.resolve(new Response(JSON.stringify({
		access_token: "foo",
		refresh_token: null,
		scope: ["user_read_email"]
	}), {
		status: StatusCodes.OK
	}));
}

function getVerificationResponse(status : number) : Promise<Response> {
	return Promise.resolve(new Response("", {
		status
	}));
}

function getTwitchResponse(subscription : ITwitchSubscription, isAuthorized : boolean) : ITwitchResponse {
	return new TwitchResponse({
		headers: getHeaders(isAuthorized),
		body: new TwitchWebhookRequestBody(subscription).getBody(),
		method: "POST"
	}, new Response("", {
		status: 202
	}));
}

function getHeaders(isAuthorized : boolean) : Headers {
	return isAuthorized ? 
		new Headers({
			"Client-ID": "test-client",
			"Content-Type": "application/json",
			"Authorization": "Bearer foo"
		}) : 
		new Headers({
			"Client-ID": "test-client",
			"Content-Type": "application/json",
		});
}