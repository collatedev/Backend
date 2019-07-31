import ICallbackRouter from './ICallbackRouter';
import ILogger from '../../Logging/ILogger';
import Router from '../../Router/Router';
import { Request, Response } from 'express';
import ValidationSchema from '../../RequestValidator/ValidationSchema/ValidationSchema';
import WebhookRequestSchema from '../../RequestSchemas/WebhookChallengeRequest.json';
import IValidationSchema from '../../RequestValidator/ValidationSchema/IValidationSchema';
import StatusCodes from '../../Router/StatusCodes';
import CreatedVideoNotification from '../../Notification/Youtube/CreatedVideoNotification';
import ICreatedVideoNotification from '../../Notification/Youtube/ICreatedVideoNotification';
import NotificationType from '../../Notification/NotificationType';
import IUser from '../../UserService/Models/IUser';
import UserModel from '../../UserService/Models/UserModel';
import ICreatedVideoPayload from '../Notification/ICreatedVideoPayload';
import CreatedVideoPayload from '../Notification/CreatedVideoPayload';
import { IDeletedVideoPayload } from '../Notification/IDeletedVideoPayload';
import DeletedVideoPayload from '../Notification/DeletedVideoPayload';

const InsecureSchema : IValidationSchema = new ValidationSchema({
    "types": {
        "request": {
            "body": {
                "required": false,
                "type": "any"
            },
            "query": {
                "required": false,
                "type": "any"
            },
            "headers": {
                "required": false,
                "type": "any"
            },
            "cookies": {
                "required": false,
                "type": "any"
            },
            "params": {
                "required": false,
                "type": "any"
            }
        }
    }
});

export default class CallbackRouter extends Router implements ICallbackRouter {
    constructor(logger : ILogger) {
        super('/youtube', logger);
        this.handleCallback = this.handleCallback.bind(this);
        this.handleChallenge = this.handleChallenge.bind(this);
    }

    public setup() : void {
        this.get('/', this.handleChallenge, new ValidationSchema(WebhookRequestSchema));
        this.post('/', this.handleCallback, InsecureSchema);
    }

    public async handleChallenge(request : Request, response : Response) : Promise<void> {
        response.send(request.query["hub.challenge"]).status(StatusCodes.OK);
    }

    public async handleCallback(request : Request, response : Response) : Promise<void> {
        this.logger.info(`recieved body: ${JSON.stringify(request.body)}`);
        try {
            if (this.wasVideoCreated(request)) {
                await this.createVideoNotification(request, response);
            } else {
                await this.deleteVideoNotification(request, response);
            }
            this.logger.info(`Successfully processed youtube callback`);
        } catch (error) {
            this.logger.error(error);
            this.sendError(response, error, StatusCodes.InternalError);
        }
    }

    private wasVideoCreated(request : Request) : boolean {
        return request.body.feed.hasOwnProperty("entry");
    }

    private async createVideoNotification(request : Request, response : Response) : Promise<void> {
        const payload : ICreatedVideoPayload = new CreatedVideoPayload(request);

        const user : IUser | null = await UserModel.findUserByYoutubeID(payload.channelID());
        if (user === null) {
            this.logger.error(`Failed to find user with channelID: "${payload.channelID()}"`);
            response.send().status(StatusCodes.InternalError);
            return;
        }

        const notification : ICreatedVideoNotification = new CreatedVideoNotification({
            type: NotificationType.Youtube.CreateVideo,
            channelID: payload.channelID(),
            datePublished: payload.datePublished(),
            fromUserID: user.id,
            link: payload.link(),
            title: payload.title(),
            videoID: payload.videoID()
        });

        if (await notification.isDuplicate()) {
            this.logger.warn("Attempted to create duplicate notification");
            response.send().status(StatusCodes.BadRequest);
            return;
        }
        await notification.save();
        response.send().status(StatusCodes.OK);
    }

    private async deleteVideoNotification(request : Request, response : Response) : Promise<void> {
        const payload : IDeletedVideoPayload = new DeletedVideoPayload(request);
        
        await CreatedVideoNotification.deleteOne({
            videoID: payload.videoID()
        }).exec();
    }
}