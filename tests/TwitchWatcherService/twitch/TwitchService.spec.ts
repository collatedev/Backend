import { Response } from 'node-fetch';
import StatusCodes from '../../../src/Router/StatusCodes';
import MockLogger from '../../mocks/MockLogger';
import ITwitchService from '../../../src/TwitchWatcher/Twitch/ITwitchService';
import TwitchService from '../../../src/TwitchWatcher/Twitch/TwitchService';
import FetchRequestBuilder from '../../../src/TwitchWatcher/RequestBuilder/FetchRequestBuilder';
import SecretGenerator from '../../../src/TwitchWatcher/Twitch/SecretGenerator';

describe('subscribe', () => {
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

	test('Should send all subscriptions successfully', async () => {
		process.env.NODE_ENV = "test";
		FetchRequestBuilder.prototype.makeRequest = jest.fn()
			.mockReturnValueOnce(getBearerResponse())
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.Accepted))
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.Accepted))
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.Accepted))
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.Accepted));

		const twitch : ITwitchService = new TwitchService(new MockLogger());
		await twitch.subscribe(1);
	});

	test('Should fail to send request due to bad request statuses', async () => {
		process.env.NODE_ENV = "test";
		FetchRequestBuilder.prototype.makeRequest = jest.fn()
			.mockReturnValueOnce(getBearerResponse())
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.BadRequest))
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.BadRequest))
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.BadRequest))
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.BadRequest));

		const twitch : ITwitchService = new TwitchService(new MockLogger());

		await expect(twitch.subscribe(1)).rejects.toEqual(new Error(
			`Failed to subscribe to {"hub.mode":"subscribe","hub.topic":"https://api.twitch.tv/` +
			`helix/users/follows?first=1&to_id=1","hub.secret":"secret","hub.callba` +
			`ck":"endpoint_url/follow/new","hub.lease_seconds":300}`
		));
	});

	test('Should fail to send subscriptions due to a failed request', async () => {
		process.env.NODE_ENV = "test";
		FetchRequestBuilder.prototype.makeRequest = jest.fn().mockReturnValue(getRequestFailedResponse());
		const twitch : ITwitchService = new TwitchService(new MockLogger());
		await expect(twitch.subscribe(1)).rejects.toThrow(new Error("Request failed"));
	});
});

function getAuthorizationResponse(status: number) : Promise<Response> {
	return Promise.resolve(new Response("", { status }));
}

function getBearerResponse(): Promise<Response> {
	return Promise.resolve(new Response(JSON.stringify({
		access_token: "asdfasdf",
		refresh_token: "eyJfMzUtNDU0OC04MWYwLTQ5MDY5ODY4NGNlMSJ9%asdfasdf=",
		scope: ["user_read_email"]
	}), {
		status: StatusCodes.OK
	}));
}

function getRequestFailedResponse() : Promise<Response> {
	return Promise.reject(new Error("Request failed"));
}