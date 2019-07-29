import mockResponse from '../../mocks/MockResponse';
import mockRequest from '../../mocks/MockRequest';
import UserRouter from '../../../src/UserService/Routes/UserRouter';
import ILogger from '../../../src/Logging/ILogger';
import MockLogger from '../../mocks/MockLogger';
import IRouteHandler from '../../../src/Router/IRouteHandler';
import StatusCodes from '../../../src/Router/StatusCodes';
import ErrorMessage from '../../../src/Router/Messages/ErrorMessage';
import IUserLayer from '../../../src/UserService/layers/IUserLayer';
import DataMessage from '../../../src/Router/Messages/DataMessage';
import GetUserRequestSchema from '../../../src/UserService/RequestSchemas/GetUserRequest.json';
import ValidationSchema from '../../../src/RequestValidator/ValidationSchema/ValidationSchema';
import validate from '../../../src/Router/Middleware/Validate';
import UserLayer from '../../../src/UserService/Layers/UserLayer';
import IUser from '../../../src/UserService/Models/IUser';
import UserModel from '../../../src/UserService/Models/UserModel';
import Youtube from '../../../src/YoutubeWatcher/Youtube/Youtube';
import TwitchService from '../../../src/TwitchWatcher/Twitch/TwitchService';
import IYoutubeChannel from '../../../src/UserService/Models/IYoutubeChannel';
import YoutubeChannel from '../../../src/UserService/Models/YoutubeChannel';

jest.mock('../../../src/YoutubeWatcher/Youtube/Youtube');
jest.mock('../../../src/TwitchWatcher/Twitch/TwitchService');

const logger : ILogger = new MockLogger();
const userLayer : IUserLayer = getUserLayer();
const router : UserRouter = new UserRouter(userLayer, logger);
router.setup();

describe("validate() [middleware]", () => {
	test('Should fail to validate due to incorrect type', () => { 
		const request : any = mockRequest({
            params: {
                userID: 1
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
                    message: "Property 'userID' should be type 'string'",
                }
            ])
        );
    });
    
    test.todo('Should fail due to a float userID [TODO]');
});

describe('handleGetUserByID()', () => {
    test('Should fail because user does not exist', async () => {
        UserLayer.prototype.getUserInfo = jest.fn().mockReturnValueOnce(
            Promise.reject(new Error("Failed to get user with id: 1"))
        );
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
        const channel : IYoutubeChannel = createYoutubeChannel("foo", "bar", "baz");
        UserLayer.prototype.getUserInfo = jest.fn().mockReturnValue(
            Promise.resolve(createUser(1, channel))
        );
        const user : IUser = createUser(1, channel);
        const request : any = mockRequest({
            params: {
                userID: user.id
            }
        });
        const response : any = mockResponse();
        
        await router.handleGetUserByID(request, response);

        expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(response.json).toHaveBeenCalledWith(new DataMessage(user.toJSON()));
    });
});

function createUser(twitchID : number, channel : IYoutubeChannel) : IUser {
    return new UserModel({
        twitchID,
        youtubeChannel: channel
    });
} 

function createYoutubeChannel(name : string, id: string, title : string) : IYoutubeChannel {
    return new YoutubeChannel(name, {
        items: [{ 
            id,
            snippet: {
                title
            }
        }]
    });
}

function getUserLayer() : IUserLayer {
    return new UserLayer(new TwitchService(new MockLogger()), new Youtube());
}