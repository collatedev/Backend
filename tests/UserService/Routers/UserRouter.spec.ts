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
import Twitch from '../../../src/TwitchWatcher/Twitch/Twitch';
import IYoutubeChannel from '../../../src/UserService/Models/IYoutubeChannel';
import YoutubeChannel from '../../../src/UserService/Models/YoutubeChannel';
import ITwitchUser from '../../../src/UserService/Models/ITwitchUser';
import TwitchUser from '../../../src/UserService/Models/TwitchUser';

jest.mock('../../../src/YoutubeWatcher/Youtube/Youtube');
jest.mock('../../../src/TwitchWatcher/Twitch/Twitch');

const logger : ILogger = new MockLogger();
const userLayer : IUserLayer = getUserLayer();
const router : UserRouter = new UserRouter(userLayer, logger);
router.setup();

describe("validate() [middleware]", () => {
	test('Should fail to validate due to incorrect type', () => { 
		const request : any = mockRequest({
            params: {
                userID: "asdf"
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
                },
                {
                    location: "params.userID",
                    message: "The value 'asdf' must be an int",
                }
            ])
        );
    });
    
    test('Should fail due to a float userID', () => {
        const request : any = mockRequest({
            params: {
                userID: 1.1
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
                    message: "The value '1.1' must be an int",
                }
            ])
        );
    });
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
        const twitchUser : ITwitchUser = new TwitchUser(1);
        const user : IUser = createUser(twitchUser, channel);
        UserLayer.prototype.getUserInfo = jest.fn().mockReturnValue(
            Promise.resolve(user)
        );
        const request : any = mockRequest({
            params: {
                userID: user.id
            }
        });
        const response : any = mockResponse();
        
        await router.handleGetUserByID(request, response);

        expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(response.json).toHaveBeenCalledWith(new DataMessage(user.toObject()));
    });
});

function createUser(twitchUser : ITwitchUser, youtubeChannel : IYoutubeChannel) : IUser {
    return new UserModel({
        twitchUser,
        youtubeChannel
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
    return new UserLayer(new Twitch(new MockLogger()), new Youtube());
}