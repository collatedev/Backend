import { Response } from 'node-fetch';
import StatusCodes from '../../../src/Router/StatusCodes';
import MockFetchRequestBuilder from '../../mocks/MockFetchRequestBuilder';
import MockSecretGenerator from '../../mocks/MockSecretGenerator';
import MockLogger from '../../mocks/MockLogger';
import ITwitchService from '../../../src/TwitchWatcher/Twitch/ITwitchService';
import TwitchService from '../../../src/TwitchWatcher/Twitch/TwitchService';

const WebhookCount : number = 4;

describe('subscribe', () => {
	const OLD_ENV : any = process.env;

	beforeEach(() => {
		jest.resetModules(); // this is important - it clears the cache
		process.env = { ...OLD_ENV };
		delete process.env.NODE_ENV;
	});

	afterEach(() => {
		process.env = OLD_ENV;
	});

	test('Should send all subscriptions successfully', async () => {
		process.env.NODE_ENV = "test";
		const requestBuilder : MockFetchRequestBuilder = new MockFetchRequestBuilder();
		queueBearerResponse(requestBuilder);
		queueAuthorizationResponses(requestBuilder, StatusCodes.Accepted);

		const twitch : ITwitchService = new TwitchService(requestBuilder, new MockSecretGenerator("foo"), new MockLogger());
		
		await twitch.subscribe(1);
	});

	test('Should fail to send request due to bad request statuses', async () => {
		process.env.NODE_ENV = "test";
		const requestBuilder : MockFetchRequestBuilder = new MockFetchRequestBuilder();
		queueBearerResponse(requestBuilder);
		queueAuthorizationResponses(requestBuilder, StatusCodes.BadRequest);
		const twitch : ITwitchService = new TwitchService(
			requestBuilder, 
			new MockSecretGenerator("secret"), 
			new MockLogger()
		);

		await expect(twitch.subscribe(1)).rejects.toEqual(new Error(
			`Failed to subscribe to {"hub.mode":"subscribe","hub.topic":"https://api.twitch.tv/` +
			`helix/users/follows?first=1&to_id=1","hub.secret":"secret","hub.callba` +
			`ck":"endpoint_url/follow/new","hub.lease_seconds":300}`
		));
	});

	test('Should fail to send subscriptions due to a failed request', async () => {
		process.env.NODE_ENV = "test";
		const requestBuilder : MockFetchRequestBuilder = new MockFetchRequestBuilder();
		queueBearerResponse(requestBuilder);
		const twitch : ITwitchService = new TwitchService(requestBuilder, new MockSecretGenerator("foo"), new MockLogger());

		await expect(twitch.subscribe(1)).rejects.toEqual(new Error("Request Failed"));
	});
});

function queueBearerResponse(builder: MockFetchRequestBuilder) : void {
	builder.queueResponse(new Response(getAuthorizationBearer(), {
		status: 200
	}));
}

function queueAuthorizationResponses(builder: MockFetchRequestBuilder, status: number) : void {
	for (let i : number = 0; i < WebhookCount; i++) {
		builder.queueResponse(new Response("", { status }));
	}
}

function getAuthorizationBearer(): string {
	return JSON.stringify({
		access_token: "asdfasdf",
		refresh_token: "eyJfMzUtNDU0OC04MWYwLTQ5MDY5ODY4NGNlMSJ9%asdfasdf=",
		scope: ["user_read_email"]
	});
}