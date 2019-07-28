import mockResponse from '../../mocks/MockResponse';
import mockRequest from '../../mocks/MockRequest';
import UserRouter from '../../../src/UserService/Routes/UserRouter';
import MockUserLayer from '../../mocks/MockUserLayer';
import ILogger from '../../../src/Logging/ILogger';
import MockLogger from '../../mocks/MockLogger';
import MockUserModel from '../../mocks/MockUserModel';
import IRouteHandler from '../../../src/Router/IRouteHandler';
import StatusCodes from '../../../src/Router/StatusCodes';
import ErrorMessage from '../../../src/Router/Messages/ErrorMessage';
import IUserLayer from '../../../src/UserService/layers/IUserLayer';
import DataMessage from '../../../src/Router/Messages/DataMessage';
import GetUserRequestSchema from '../../../src/UserService/RequestSchemas/GetUserRequest.json';
import ValidationSchema from '../../../src/RequestValidator/ValidationSchema/ValidationSchema';
import NewUserData from '../../../src/UserService/Layers/NewUserData';
import validate from '../../../src/Router/Middleware/Validate';

const logger : ILogger = new MockLogger();

describe("validate() [middleware]", () => {
	test('Should fail to validate due to incorrect type', () => {
        const router : UserRouter = new UserRouter(new MockUserLayer(new MockUserModel()), logger);
        router.setup();
		const request : any = mockRequest({
            params: {
                userID: "string"
            }
        });
		const response : any = mockResponse();
	
		const middleWare : IRouteHandler = validate(new ValidationSchema(GetUserRequestSchema));
        middleWare(request, response);
        expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
        expect(response.json).toHaveBeenCalledWith(
            new ErrorMessage([
                {
                    location: "params.userID",
                    message: "Property 'userID' should be type 'number'",
                }
            ])
        );
    });
    
    test('Should fail due to a float userID [TODO]', async () => {
        // Need to update sanitizer to ensure that only integers can be passed
    });
});

describe('handleGetUserByID()', () => {
    test('Should fail because user does not exist', async () => {
        const router : UserRouter = new UserRouter(new MockUserLayer(new MockUserModel()), logger);
        router.setup();
        const request : any = mockRequest({
            params: {
                userID: 1
            }
        });
        const response : any = mockResponse();

        await router.handleGetUserByID(request, response);

        expect(response.status).toHaveBeenCalledWith(StatusCodes.NotFound);
        expect(response.json).toHaveBeenCalledWith(
            new ErrorMessage("Failed to get user with id: 1")
        );
    });

    test('Should get user data', async () => {
        const twitchModel : MockUserModel = new MockUserModel();
        const userLayer : IUserLayer = new MockUserLayer(twitchModel);
        const router : UserRouter = new UserRouter(userLayer, logger);
        router.setup();
        const request : any = mockRequest({
            params: {
                userID: 0
            }
        });
        const response : any = mockResponse();
        await userLayer.createUser(new NewUserData({
            twitchUserID: 1,
            youtubeChannelName: "foo"
        }));

        await router.handleGetUserByID(request, response);

        expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(response.json).toHaveBeenCalledWith(
            new DataMessage(await twitchModel.getByID(0))
        );
    });
});
	