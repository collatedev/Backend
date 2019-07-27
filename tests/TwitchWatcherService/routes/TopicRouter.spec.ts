import MockTopicRouter from "../../mocks/MockTopicRouter";
import MockBody from "../../mocks/MockBody";
import mockResponse from '../../mocks/MockResponse';
import mockRequest from '../../mocks/MockRequest';
import ChallengeQueryRequestSchema from '../../../src/TwitchWatcher/RequestSchemas/WebhookChallengeRequest.json';
import TopicTestRequestSchema from '../RequestSchema/TestTopic.json';
import IValidationSchema from "../../../src/RequestValidator/ValidationSchema/IValidationSchema";
import ValidationSchema from "../../../src/RequestValidator/ValidationSchema/ValidationSchema";
import StatusCodes from "../../../src/Router/StatusCodes";
import TopicRouter from "../../../src/TwitchWatcher/Routes/TopicRouter";
import IRouteHandler from "../../../src/Router/IRouteHandler";
import ErrorMessage from "../../../src/Router/Messages/ErrorMessage";
import DataMessage from "../../../src/Router/Messages/DataMessage";

const ChallengeSchema : IValidationSchema = new ValidationSchema(ChallengeQueryRequestSchema);
const TopicTestSchema : IValidationSchema = new ValidationSchema(TopicTestRequestSchema);

describe("validate() [middleware]", () => {
	test(`Should fail because the body is empty`, async () => {
        const router : TopicRouter = new MockTopicRouter(TopicTestSchema);
        router.setup();
        const request : any = mockRequest({});
        const response : any = mockResponse();
	
		const middleWare : IRouteHandler = router.validate(ChallengeSchema);
		middleWare(request, response);
		expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
		expect(response.json).toHaveBeenCalledWith(
			new ErrorMessage([
				{
					location: "",
					message: "Missing property 'query'",
				}
			])
		);
	});

	test('Should fail because hub.mode is missing', async () => {
		const router : TopicRouter = new MockTopicRouter(TopicTestSchema);
		router.setup();
		const request : any = mockRequest({
			query: {
				"hub.topic": "http://test.com",
				"hub.lease_seconds": 123,
				"hub.challenge": "challenge token"
			}
		});
		const response : any = mockResponse();

		const middleWare : IRouteHandler = router.validate(ChallengeSchema);
		middleWare(request, response);
		expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
		expect(response.json).toHaveBeenCalledWith(
			new ErrorMessage([
				{
					location: "query",
					message: "Missing property 'hub.mode'",
				}
			])
		);
	});

	test('Should fail because hub.topic is missing', async () => {
		const router : TopicRouter = new MockTopicRouter(TopicTestSchema);
		router.setup();
		const request : any = mockRequest({
			query: {
				"hub.mode": "subscribe",
				"hub.lease_seconds": 123,
				"hub.challenge": "challenge token"
			}
		});
		const response : any = mockResponse();

		const middleWare : IRouteHandler = router.validate(ChallengeSchema);
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

	test('Should fail because hub.challenge is missing', async () => {
		const router : TopicRouter = new MockTopicRouter(TopicTestSchema);
		router.setup();
		const request : any = mockRequest({
			query: {
				"hub.topic": "http://test.com",
				"hub.mode": "subscribe",
				"hub.lease_seconds": 123
			}
		});
		const response : any = mockResponse();

		const middleWare : IRouteHandler = router.validate(ChallengeSchema);
		middleWare(request, response);
		expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
		expect(response.json).toHaveBeenCalledWith(
			new ErrorMessage([
				{
					location: "query",
					message: "Missing property 'hub.challenge'",
				}
			])
		);
	});

	test('Should fail because body is not valid', async () => {
		const router : TopicRouter = new MockTopicRouter(TopicTestSchema);
		router.setup();
		const request : any = mockRequest({
			query: {
				a: {
					
				}
			}
		});
		const response : any = mockResponse();

		const middleWare : IRouteHandler = router.validate(TopicTestSchema);
		middleWare(request, response);
		expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
		expect(response.json).toHaveBeenCalledWith(
			new ErrorMessage([
				{
					location: "query.a",
					message: "Property 'a' should be type 'boolean'",
				}
			])
		);
	});
});

describe('handleChallenge', () => {
	test('Should call send with challenge token', async () => {
		const router : TopicRouter = new MockTopicRouter(TopicTestSchema);
		router.setup();
		const request : any = mockRequest({
			query: {
				"hub.topic": "value",
				"hub.mode": "value",
				"hub.lease_seconds": 123,
				"hub.challenge": "challenge_token"
			}
		});
		const response : any = mockResponse();

		await router.handleWebhookCall(request, response);

		expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
		expect(response.json).toHaveBeenCalledWith(new DataMessage({
			desc: `Recieved data under topic: /test`,
			body: undefined,
			processedData: true
		}));
	});
});

describe('handleWebhookCall', () => {
	test('Should fail to process data', async () => {
		const router : MockTopicRouter = new MockTopicRouter(TopicTestSchema);
		router.setup();
		const request : any = mockRequest({
			body: {
				a: true
			}
		});
		const response : any = mockResponse();
		router.failNextRequest();

		await router.handleWebhookCall(request, response);

		expect(response.status).toHaveBeenCalledWith(StatusCodes.InternalError);
		expect(response.json).toHaveBeenCalledWith(new ErrorMessage("Failed to process webhook data"));
	});

	test('Should process data', async () => {
		const router : TopicRouter = new MockTopicRouter(TopicTestSchema);
		router.setup();
		const request : any = mockRequest({
			body: {
				a: true
			}
		});
		const response : any = mockResponse();

		await router.handleWebhookCall(request, response);

		expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
		expect(response.json).toHaveBeenCalledWith(
			new DataMessage({
				desc: `Recieved data under topic: /test`,
				body: new MockBody({ a: true }),
				processedData: true
			})
		);
	});
});