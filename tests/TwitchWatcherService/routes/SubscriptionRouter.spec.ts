import mockResponse from '../../mocks/MockResponse';
import mockRequest from '../../mocks/MockRequest';
import SubscriptionRouter from '../../../src/TwitchWatcher/routes/SubscriptionRouter';
import MockUserLayer from '../../mocks/MockUserLayer';
import MockUserModel from '../../mocks/MockUserModel';
import MockLogger from '../../mocks/MockLogger';
import ILogger from '../../../src/Logging/ILogger';
import StatusCodes from '../../../src/Router/StatusCodes';
import ErrorMessage from '../../../src/TwitchWatcher/messages/ErrorMessage';
import IRouteHandler from '../../../src/Router/IRouteHandler';
import ValidationSchema from '../../../src/RequestValidator/ValidationSchema/ValidationSchema';
import TwitchUser from '../../../src/TwitchWatcher/schemas/user/TwitchUser';
import SubscriptonSchema from '../../../src/TwitchWatcher/api/SubscriptionRequest.json';
import DataMessage from '../../../src/TwitchWatcher/messages/DataMessage';

const logger : ILogger = new MockLogger();

describe("validate() [middleware]", () => {
	test(`Should fail because the body is empty`, async () => {
        const router : SubscriptionRouter = new SubscriptionRouter(
            new MockUserLayer(new MockUserModel()), 
            logger
        );
        router.setup();
        const request : any = mockRequest({});
        const response : any = mockResponse();
	
		const middleWare : IRouteHandler = router.validate(new ValidationSchema(SubscriptonSchema));
        middleWare(request, response);
        expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
        expect(response.json).toHaveBeenCalledWith(
            new ErrorMessage([
                {
                    location: "",
                    message: "Missing property 'body'",
                }
            ])
        );
    });
    
    test(`Should fail because the body does not contain a user ID`, async () => {
        const router : SubscriptionRouter = new SubscriptionRouter(
            new MockUserLayer(new MockUserModel()),
            logger
        );
        router.setup();
        const request : any = mockRequest({
            body: {
                foo: "bar"
            }
        });
        const response : any = mockResponse();

        const middleWare : IRouteHandler = router.validate(new ValidationSchema(SubscriptonSchema));
        middleWare(request, response);
        expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
        expect(response.json).toHaveBeenCalledWith(
            new ErrorMessage([
                {
                    location: "body",
                    message: "Missing property 'userID'",
                },
                {
                    location: "body",
                    message: "Unexpected property 'foo'",
                }
            ])
        );
    });
});

describe('handleSubscription', () => {
    test(`Should fail because the userID is unknown`, async () => {
        const router : SubscriptionRouter = new SubscriptionRouter(
            new MockUserLayer(new MockUserModel()),
            logger
        );
        router.setup();
        const request : any = mockRequest({
            body: {
                callbackURL: "callbackURL",
                topic: "topic",
                userID: 1
            }
        });
        const response : any = mockResponse();

        await router.handleSubscription(request, response);

        expect(response.status).toHaveBeenCalledWith(StatusCodes.InternalError);
        expect(response.json).toHaveBeenCalledWith(
            new ErrorMessage("Failed to subscribe user to webhook")
        );
    });

    test(`Should get user information with the subscription updated`, async() => {
        const userModel : MockUserModel = new MockUserModel();
        userModel.addUser(1);
        const router : any = new SubscriptionRouter(new MockUserLayer(userModel), logger);
        router.setup();
        const request : any = mockRequest({
            body: {
                callbackURL: "callbackURL",
                topic: "topic",
                userID: 1
            }
        });
        const response : any = mockResponse();
        const expectedUser : TwitchUser = new TwitchUser(1);

        await router.handleSubscription(request, response);

        expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(response.json).toHaveBeenCalledWith(new DataMessage(expectedUser));
    });
});

describe('handleUnsubscription', () => {
    test(`Should fail because the userID is unknown`, async () => {
        const router : SubscriptionRouter = new SubscriptionRouter(
            new MockUserLayer(new MockUserModel()),
            logger
        );
        router.setup();
        const request : any = mockRequest({
            body: {
                topic: "topic",
                userID: 1
            }
        });
        const response : any = mockResponse();

        await router.handleUnsubscription(request, response);

        expect(response.status).toHaveBeenCalledWith(StatusCodes.InternalError);
        expect(response.json).toHaveBeenCalledWith(
            new ErrorMessage("Failed to unsubscribe user from webhook")
        );
    });

    test(`Should get user information with the subscription updated`, async() => {
        const userModel : MockUserModel = new MockUserModel();
        const router : SubscriptionRouter = new SubscriptionRouter(new MockUserLayer(userModel), logger);
        userModel.addUser(1);
        router.setup();
        const request : any = mockRequest({
            body: {
                topic: "topic",
                userID: 1
            }
        });
        const response : any = mockResponse();
        const expectedUser : TwitchUser = new TwitchUser(1);

        await router.handleUnsubscription(request, response);

        expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(response.json).toHaveBeenCalledWith(new DataMessage(expectedUser));
    });
});