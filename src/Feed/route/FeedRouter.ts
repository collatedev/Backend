import Router from "../../Router/Router";
import ILogger from "../../Logging/ILogger";
import { Request, Response } from "express";
import FeedSchema from "../Validation/FeedSchema.json";
import ValidationSchema from "../../RequestValidator/ValidationSchema/ValidationSchema";
import INotification from "../../Notification/INotification";
import Notification from "../../Notification/Notification";
import StatusCodes from "../../Router/StatusCodes";

const Limit : number = 20;

export default class FeedRouter extends Router {
    constructor(logger : ILogger) {
        super("feed", logger);
        this.getFeed = this.getFeed.bind(this);
    }

    public setup() : void {
        this.get("/:userID", this.getFeed, new ValidationSchema(FeedSchema));
    }

    public async getFeed(request : Request, response : Response) : Promise<void> {
        try {
            const feed : INotification[] = await Notification
            .find()
            .sort({
                createdAt: 'desc'
            })
            .skip(request.query.offset)
            .limit(Limit)
            .exec();
            this.sendData(response, feed, StatusCodes.OK);
        } catch (error) {
            this.sendError(response, error, StatusCodes.InternalError);
        }
    }
}