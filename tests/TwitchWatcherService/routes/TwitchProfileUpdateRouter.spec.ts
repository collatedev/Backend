import mockResponse from '../../mocks/MockResponse';
import mockRequest from '../../mocks/MockRequest';
import ChallengeQueryRequestSchema from '../../../src/TwitchWatcher/RequestSchemas/WebhookChallengeRequest.json';
import IValidationSchema from '../../../src/RequestValidator/ValidationSchema/IValidationSchema';
import ValidationSchema from '../../../src/RequestValidator/ValidationSchema/ValidationSchema';
import ILogger from '../../../src/Logging/ILogger';
import MockLogger from '../../mocks/MockLogger';
import TwitchProfileUpdateRouter from '../../../src/TwitchWatcher/Routes/TwitchProfileUpdateRouter';
import IRouteHandler from '../../../src/Router/IRouteHandler';
import StatusCodes from '../../../src/Router/StatusCodes';
import ErrorMessage from '../../../src/Router/Messages/ErrorMessage';

const ChallengeSchema : IValidationSchema = new ValidationSchema(ChallengeQueryRequestSchema);

const logger : ILogger = new MockLogger();

const Router : TwitchProfileUpdateRouter = new TwitchProfileUpdateRouter(logger);
Router.setup();

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
	
		const middleWare : IRouteHandler = Router.validate(ChallengeSchema);
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
	test('Should process data', async () => {
		const request : any = mockRequest({
			body: {
				data: []
			}
		});
		const response : any = mockResponse();
	
		await Router.handleWebhookCall(request, response);
	});
});