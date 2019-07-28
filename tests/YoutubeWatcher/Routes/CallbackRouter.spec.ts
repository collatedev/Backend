import CallbackRouter from "../../../src/YoutubeWatcher/Routes/CallbackRouter";
import MockLogger from "../../mocks/MockLogger";
import mockRequest from "../../mocks/MockRequest";
import MockResponse from "../../mocks/MockResponse";
import StatusCodes from "../../../src/Router/StatusCodes";
import IRouteHandler from "../../../src/Router/IRouteHandler";
import IValidationSchema from "../../../src/RequestValidator/ValidationSchema/IValidationSchema";
import ValidationSchema from "../../../src/RequestValidator/ValidationSchema/ValidationSchema";
import WebhookSchema from "../../../src/RequestSchemas/WebhookChallengeRequest.json";
import ErrorMessage from "../../../src/Router/Messages/ErrorMessage";
import validate from "../../../src/Router/Middleware/Validate";

const schema : IValidationSchema = new ValidationSchema(WebhookSchema);
const router : CallbackRouter = new CallbackRouter(new MockLogger());
router.setup();

describe("constructor", () => {
    test("It checks that the route has the proper path", () => {
    
        expect(router.getPath()).toEqual("/api/v1/youtube");
    });
});

describe("handleChallenge", () => {
    test("It fails due to missing challenge", () => {
        const request : any = mockRequest({
			query: {
				"hub.topic": "http://foo.com",
				"hub.mode": "subscribe",
            },
            headers: {}
		});
        const response : any = MockResponse();

        const middleWare : IRouteHandler = validate(schema);
        middleWare(request, response);
        expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
		expect(response.json).toHaveBeenCalledWith(new ErrorMessage([
            {
                message: "Missing property 'hub.challenge'",
                location: "query"
            }
        ]));
    });

    test("It fails due to missing topic", () => {
        const request : any = mockRequest({
			query: {
                "hub.mode": "subscribe",
                "hub.challenge": "challenge_token"
            },
            headers: {}
		});
        const response : any = MockResponse();

        const middleWare : IRouteHandler = validate(schema);
        middleWare(request, response);
        expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
		expect(response.json).toHaveBeenCalledWith(new ErrorMessage([
            {
                message: "Missing property 'hub.topic'",
                location: "query"
            }
        ]));
    });

    test("It fails due to missing mode", () => {
        const request : any = mockRequest({
			query: {
                "hub.topic": "http://foo.com",
                "hub.challenge": "challenge_token"
            },
            headers: {}
		});
        const response : any = MockResponse();

        const middleWare : IRouteHandler = validate(schema);
        middleWare(request, response);
        expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
		expect(response.json).toHaveBeenCalledWith(new ErrorMessage([
            {
                message: "Missing property 'hub.mode'",
                location: "query"
            }
        ]));
    });

    test("It fails due to extra property", () => {
        const request : any = mockRequest({
			query: {
                "hub.topic": "http://foo.com",
                "hub.mode": "subscribe",
                "hub.challenge": "challenge_token",
                "hub.malicious": "malicious data"
            },
            headers: {}
		});
        const response : any = MockResponse();

        const middleWare : IRouteHandler = validate(schema);
        middleWare(request, response);
        expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
		expect(response.json).toHaveBeenCalledWith(new ErrorMessage([
            {
                message: "Unexpected property 'hub.malicious'",
                location: "query"
            }
        ]));
    });

    test("It fails due to having a body", () => {
        const request : any = mockRequest({
			query: {
                "hub.topic": "http://foo.com",
                "hub.mode": "subscribe",
                "hub.challenge": "challenge_token"
            },
            body: "Malicious body",
            headers: {}
		});
        const response : any = MockResponse();

        const middleWare : IRouteHandler = validate(schema);
        middleWare(request, response);
        expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
		expect(response.json).toHaveBeenCalledWith(new ErrorMessage([
            {
                message: "Unexpected property 'body'",
                location: ""
            }
        ]));
    });

    test("It sends back the correct challenge value", async () => {
        const request : any = mockRequest({
			query: {
				"hub.topic": "value",
				"hub.mode": "value",
				"hub.lease_seconds": 123,
				"hub.challenge": "challenge_token"
            },
            headers: {}
		});
        const response : any = MockResponse();

        await router.handleChallenge(request, response);

		expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
		expect(response.send).toHaveBeenCalledWith("challenge_token");
    });
});