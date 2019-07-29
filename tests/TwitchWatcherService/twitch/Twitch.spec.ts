import { Response } from 'node-fetch';
import StatusCodes from '../../../src/Router/StatusCodes';
import MockLogger from '../../mocks/MockLogger';
import ITwitch from '../../../src/TwitchWatcher/Twitch/ITwitch';
import Twitch from '../../../src/TwitchWatcher/Twitch/Twitch';
import FetchRequestBuilder from '../../../src/HTTPRequestBuilder/FetchRequestBuilder';
import SecretGenerator from '../../../src/TwitchWatcher/Twitch/SecretGenerator';
import TwitchUser from '../../../src/UserService/Models/TwitchUser';
import ITwitchUser from '../../../src/UserService/Models/ITwitchUser';
import IWebhookInfo from '../../../src/UserService/Models/IWebhookInfo';
import Service from '../../../src/UserService/Models/Service';

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

describe('getUser', () => {
	test('Should fail to get user due to bad request', async () => {
		const twitch : ITwitch = new Twitch(new MockLogger());
		FetchRequestBuilder.prototype.makeRequest = jest.fn()
			.mockReturnValue(getRequestFailedResponse());

		await expect(twitch.getUser("foo")).rejects.toThrow(new Error("Request failed"));
	});

	test('Should fail to get user due to empty payload', async () => {
		const twitch : ITwitch = new Twitch(new MockLogger());
		FetchRequestBuilder.prototype.makeRequest = jest.fn()
			.mockReturnValue(getEmptyUserResponse());

		await expect(twitch.getUser("foo")).rejects.toThrow(new Error("Could not find user with login \"foo\""));
	});

	test('Should get user', async () => {
		const twitch : ITwitch = new Twitch(new MockLogger());
		FetchRequestBuilder.prototype.makeRequest = jest.fn()
			.mockReturnValue(getUserResponse());

		const user : ITwitchUser = await twitch.getUser("foo");

		expect(user.userID).toEqual(0);
	});
});

describe('subscribe', () => {
	test('Should send all subscriptions successfully', async () => {
		process.env.NODE_ENV = "test";
		FetchRequestBuilder.prototype.makeRequest = jest.fn()
			.mockReturnValueOnce(getBearerResponse())
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.Accepted))
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.Accepted))
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.Accepted))
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.Accepted));

		const twitch : ITwitch = new Twitch(new MockLogger());
		const webhooks : IWebhookInfo[] = await twitch.subscribe(new TwitchUser(1));
		expectWebhooksToEqual(webhooks);
	});

	test('Should fail to send request due to bad request statuses', async () => {
		process.env.NODE_ENV = "test";
		FetchRequestBuilder.prototype.makeRequest = jest.fn()
			.mockReturnValueOnce(getBearerResponse())
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.BadRequest))
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.BadRequest))
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.BadRequest))
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.BadRequest));

		const twitch : ITwitch = new Twitch(new MockLogger());

		await expect(twitch.subscribe(new TwitchUser(1))).rejects.toEqual(new Error(
			`Failed to subscribe to {"hub.mode":"subscribe","hub.topic":"https://api.twitch.tv/` +
			`helix/users/follows?first=1&to_id=1","hub.secret":"secret","hub.callba` +
			`ck":"endpoint_url/twitch/topic/follow/new","hub.lease_seconds":300}`
		));
	});

	test('Should fail to send subscriptions due to a failed request', async () => {
		process.env.NODE_ENV = "test";
		FetchRequestBuilder.prototype.makeRequest = jest.fn()
			.mockReturnValueOnce(getRequestFailedResponse())
			.mockReturnValueOnce(getRequestFailedResponse())
			.mockReturnValueOnce(getRequestFailedResponse())
			.mockReturnValueOnce(getRequestFailedResponse());

		const twitch : ITwitch = new Twitch(new MockLogger());
		await expect(twitch.subscribe(new TwitchUser(1))).rejects.toThrow(new Error("Request failed"));
	});
});

describe('unsubscribe', () => {
	test('Should send all unsubscriptions successfully', async () => {
		process.env.NODE_ENV = "test";
		FetchRequestBuilder.prototype.makeRequest = jest.fn()
			.mockReturnValueOnce(getBearerResponse())
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.Accepted))
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.Accepted))
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.Accepted))
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.Accepted));

		const twitch : ITwitch = new Twitch(new MockLogger());
		const webhooks : IWebhookInfo[] = await twitch.unsubscribe(new TwitchUser(1));
		expectWebhooksToEqual(webhooks);
	});

	test('Should fail to send request due to bad request statuses', async () => {
		process.env.NODE_ENV = "test";
		FetchRequestBuilder.prototype.makeRequest = jest.fn()
			.mockReturnValueOnce(getBearerResponse())
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.BadRequest))
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.BadRequest))
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.BadRequest))
			.mockReturnValueOnce(getAuthorizationResponse(StatusCodes.BadRequest));

		const twitch : ITwitch = new Twitch(new MockLogger());

		await expect(twitch.unsubscribe(new TwitchUser(1))).rejects.toEqual(new Error(
			`Failed to subscribe to {"hub.mode":"unsubscribe","hub.topic":"https://api.twitch.tv/` +
			`helix/users/follows?first=1&to_id=1","hub.secret":"secret","hub.callba` +
			`ck":"endpoint_url/twitch/topic/follow/new","hub.lease_seconds":300}`
		));
	});

	test('Should fail to send subscriptions due to a failed request', async () => {
		process.env.NODE_ENV = "test";
		FetchRequestBuilder.prototype.makeRequest = jest.fn()
			.mockReturnValueOnce(getRequestFailedResponse())
			.mockReturnValueOnce(getRequestFailedResponse())
			.mockReturnValueOnce(getRequestFailedResponse())
			.mockReturnValueOnce(getRequestFailedResponse());

		const twitch : ITwitch = new Twitch(new MockLogger());
		await expect(twitch.unsubscribe(new TwitchUser(1))).rejects.toThrow(new Error("Request failed"));
	});
});

function getRequestFailedResponse() : Promise<Response> {
	return Promise.reject(new Error("Request failed"));
}

function getEmptyUserResponse() : Promise<Response> {
	return Promise.resolve(new Response(JSON.stringify({ 
		data: []}
	), { status : StatusCodes.OK }));
}

function getUserResponse() : Promise<Response> {
	return Promise.resolve(new Response(JSON.stringify({ 
		data: [{ id: 0 }]}
	), { status : StatusCodes.OK }));
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

function getAuthorizationResponse(status: number) : Promise<Response> {
	return Promise.resolve(new Response("", { status }));
}

function expectWebhooksToEqual(webhooks : IWebhookInfo[]) : void {
	if (webhooks.length === 0) {
		fail();	
	}
	const index1 : number = 2;
	const index2 : number = 3;

	expect(webhooks[0].callbackURL).toEqual("endpoint_url/twitch/topic/follow/new");
	expect(webhooks[0].topicURL).toEqual("https://api.twitch.tv/helix/users/follows?first=1&to_id=1");
	expect(webhooks[0].expirationDate).toBeInstanceOf(Date);
	expect(webhooks[0].service).toEqual(Service.Twitch);

	expect(webhooks[1].callbackURL).toEqual("endpoint_url/twitch/topic/follow/followed");
	expect(webhooks[1].topicURL).toEqual("https://api.twitch.tv/helix/users/follows?first=1&from_id=1");
	expect(webhooks[1].expirationDate).toBeInstanceOf(Date);
	expect(webhooks[1].service).toEqual(Service.Twitch);

	expect(webhooks[index1].callbackURL).toEqual("endpoint_url/twitch/topic/streams");
	expect(webhooks[index1].topicURL).toEqual("https://api.twitch.tv/helix/streams?user_id=1");
	expect(webhooks[index1].expirationDate).toBeInstanceOf(Date);
	expect(webhooks[index1].service).toEqual(Service.Twitch);
	
	expect(webhooks[index2].callbackURL).toEqual("endpoint_url/twitch/topic/user");
	expect(webhooks[index2].topicURL).toEqual("https://api.twitch.tv/helix/users?id=1");
	expect(webhooks[index2].expirationDate).toBeInstanceOf(Date);
	expect(webhooks[index2].service).toEqual(Service.Twitch);
}