import ICallbackRouter from './ICallbackRouter';
import ILogger from '../../Logging/ILogger';
import Router from '../../Router/Router';
import { Request, Response } from 'express';
import ValidationSchema from '../../RequestValidator/ValidationSchema/ValidationSchema';
import WebhookRequestSchema from '../../RequestSchemas/WebhookChallengeRequest.json';
import IValidationSchema from '../../RequestValidator/ValidationSchema/IValidationSchema';
import StatusCodes from '../../Router/StatusCodes';
import YoutubeVideoModel from '../../Notification/Youtube/YoutubeVideoModel';
import IYoutubeVideo from '../../Notification/Youtube/IYoutubeVideo';
import NotificationType from '../../Notification/NotificationType';
import IUser from '../../UserService/Models/IUser';
import UserModel from '../../UserService/Models/UserModel';
import ICreatedVideoPayload from '../Payload/ICreatedVideo';
import CreatedVideoPayload from '../Payload/CreatedVideo';
import { IDeletedVideoPayload } from '../Payload/IDeletedVideo';
import DeletedVideoPayload from '../Payload/DeletedVideo';
import CallbackRequestSchema from '../RequestSchemas/CallbackRequest.json';

const InsecureSchema : IValidationSchema = new ValidationSchema(CallbackRequestSchema);

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
                await this.createYoutubeVideo(request, response);
            } else {
                await this.deleteYoutubeVideo(request, response);
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

    private async createYoutubeVideo(request : Request, response : Response) : Promise<void> {
        const payload : ICreatedVideoPayload = new CreatedVideoPayload(request);
        const user : IUser = await this.getUser(payload);
		const video : IYoutubeVideo | null = 
			await YoutubeVideoModel.findByVideoID(payload.videoID());

        if (this.isNewVideo(video)) {
            await this.saveYoutubeVideo(payload, user);
        } else {
			await this.updateYoutubeVideo(video as IYoutubeVideo, payload);   
        }
        response.send().status(StatusCodes.OK);
	}
	
	private async getUser(payload : ICreatedVideoPayload) : Promise<IUser> {
		const user : IUser | null = await UserModel.findUserByYoutubeID(payload.channelID());
        if (user === null) {
            this.logger.error(`Failed to find user with channelID: "${payload.channelID()}"`);
            throw new Error("Did not find user");
		}
		return user;
	}

	private isNewVideo(notification : IYoutubeVideo | null) : boolean {
		return notification === null;
	}

	private async saveYoutubeVideo(payload : ICreatedVideoPayload, user : IUser) : Promise<void> {
		await new YoutubeVideoModel({
			type: NotificationType.Youtube.CreateVideo,
			channelID: payload.channelID(),
			datePublished: payload.datePublished(),
			fromUserID: user.id,
			link: payload.link(),
			title: payload.title(),
			videoID: payload.videoID()
		}).save();
	}

	private async updateYoutubeVideo(video : IYoutubeVideo, payload : ICreatedVideoPayload) : Promise<void> {
		if (video.title !== payload.title()) {
			video.title = payload.title();
		}
		await video.save();  
	}

    private async deleteYoutubeVideo(request : Request, response : Response) : Promise<void> {
        try {
            const payload : IDeletedVideoPayload = new DeletedVideoPayload(request);
            await YoutubeVideoModel.deleteOne({
                videoID: payload.videoID()
            }).exec();
            response.send().status(StatusCodes.OK);
        } catch(error) {
            this.logger.error(error);
            response.send().status(StatusCodes.InternalError);
        }
    }
}