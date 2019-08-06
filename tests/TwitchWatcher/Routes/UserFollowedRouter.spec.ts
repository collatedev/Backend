import mockResponse from '../../mocks/MockResponse';
import mockRequest from '../../mocks/MockRequest';
import ChallengeQueryRequestSchema from '../../../src/RequestSchemas/WebhookChallengeRequest.json';
import ILogger from '../../../src/Logging/ILogger';
import MockLogger from '../../mocks/MockLogger';
import UserFollowedRouter from '../../../src/TwitchWatcher/Routes/UserFollowedRouter';
import IRouteHandler from '../../../src/Router/IRouteHandler';
import StatusCodes from '../../../src/Router/StatusCodes';
import IValidationSchema from '../../../src/RequestValidator/ValidationSchema/IValidationSchema';
import ValidationSchema from '../../../src/RequestValidator/ValidationSchema/ValidationSchema';
import ErrorMessage from '../../../src/Router/Messages/ErrorMessage';
import validate from '../../../src/Router/Middleware/Validate';
import UserModel from '../../../src/UserService/Models/UserModel';
import TwitchFollowPayload from '../../Payload/TwitchFollowPayload';
import MockDB from '../../mocks/MockDB';
import DataMessage from '../../../src/Router/Messages/DataMessage';

const ChallengeSchema : IValidationSchema = new ValidationSchema(ChallengeQueryRequestSchema);

const logger : ILogger = new MockLogger();

const Router : UserFollowedRouter = new UserFollowedRouter(logger);
const db : MockDB = new MockDB();
const prop : any = UserModel.findByTwitchID;
Router.setup();

beforeAll(async () => {
    await db.start();
});

afterAll(async () => {
    await db.stop();
});

afterEach(async () => {
	await db.cleanup();
});

describe("validate() [middleware]", () => {
	test('Should fail to handle challenge', () => {
		const request : any = mockRequest({
			query: {
				"hub.lease_seconds": 500,
				"hub.mode": "subscribe",
				"hub.challenge": "bar"
			}
		});
		const response : any = mockResponse();
	
		const middleWare : IRouteHandler = validate(ChallengeSchema);
		middleWare(request, response);
		expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
		expect(response.json).toHaveBeenCalledWith(
			new ErrorMessage([
				{
					location: "query",
					message: "Missing property 'hub.topic'",
				}
			])
		);
	});
});

describe("handleChallenge()", () => {
	
	test('Should handle challenge', async () => {
		const request : any = mockRequest({
			query: {
				"hub.topic": "value",
				"hub.mode": "value",
				"hub.lease_seconds": 123,
				"hub.challenge": "challenge_token"
			}
		});
		const response : any = mockResponse();

		await Router.handleChallenge(request, response);
	
		expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
		expect(response.send).toHaveBeenCalledWith("challenge_token");
	});
});

describe("handleWebhookCall()", () => {
	afterEach(() => {
		UserModel.findByTwitchID = prop;
	});

	test('Should process data', async () => {
		UserModel.findByTwitchID = jest.fn().mockReturnValue(
			Promise.resolve({
				id: "foo",
				twitchUser: {
					userID: 0
				}
			})
		);
		const request : any = mockRequest({
			body: TwitchFollowPayload()
		});
		const response : any = mockResponse();
	
		await Router.handleWebhookCall(request, response);

		expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
		expect(response.json).toHaveBeenCalledWith(new DataMessage({
			desc: `Recieved data under topic: /follow/followed`,
			body: request.body,
			processedData: true,
		}));
	});

	test('Should not find a user and fail to process data', async () => {
		UserModel.findByTwitchID = jest.fn().mockReturnValue(Promise.resolve(null));
		const request : any = mockRequest({
			body: TwitchFollowPayload()
		});
		const response : any = mockResponse();
	
		await Router.handleWebhookCall(request, response);

		expect(response.status).toHaveBeenCalledWith(StatusCodes.InternalError);
		expect(response.json).toHaveBeenCalledWith(new ErrorMessage(new Error("Failed to find user with twitch id '0'")));
	});

	test('Should fail to query the database', async () => {
		UserModel.findByTwitchID = jest.fn().mockReturnValue(Promise.reject(new Error("Query failed")));
		const request : any = mockRequest({
			body: TwitchFollowPayload()
		});
		const response : any = mockResponse();
	
		await Router.handleWebhookCall(request, response);

		expect(response.status).toHaveBeenCalledWith(StatusCodes.InternalError);
		expect(response.json).toHaveBeenCalledWith(new ErrorMessage(new Error("Query failed")));
	});
});