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
        const user : IUser | null = await UserModel.findOne({
            youtubeChannel: {
                id: request.body.feed.entry[0]["yt:channelid"][0]
            }
        }).exec();
        if (user === null) {
            throw new Error(
                `Failed to find user with channelID: "${request.body.feed.entry[0]["yt:channelid"][0]}"`
            );
        }
        const notification : ICreatedVideoNotification = new CreatedVideoNotification({
            type: NotificationType.Youtube.CreateVideo,
            channelID: request.body.feed.entry[0]["yt:channelid"][0],
            datePublished: new Date(request.body.feed.entry[0].published[0]),
            fromUserID: user.id,
            link: request.body.feed.entry[0].link[0].$.href,
            title: request.body.feed.entry[0].title[0],
            videoID: request.body.feed.entry[0]["yt:videoid"][0]
        });
        await notification.save();
    }
}

// {
//     "feed": {
//         "$": {
//             "xmlns:yt": "http://www.youtube.com/xml/schemas/2015",
//             "xmlns": "http://www.w3.org/2005/Atom"
//         },
//         "link": [
//             {
//                 "$": {
//                     "rel": "hub",
//                     "href": "https://pubsubhubbub.appspot.com"
//                 }
//             },
//             {
//                 "$": {
//                     "rel": "self",
//                     "href": "https://www.youtube.com/xml/feeds/videos.xml?channel_id=UCJU7oHhmt-EUa8KNfpuvDhA"
//                 }
//             }
//         ],
//         "title": [
//             "YouTube video feed"
//         ],
//         "updated": [
//             "2019-07-30T08:07:48.581684321+00:00"
//         ],
//         "entry": [
//             {
//                 "id": [
//                     "yt:video:WbzYmskEgDE"
//                 ],
//                 "yt:videoid": [
//                     "WbzYmskEgDE"
//                 ],
//                 "yt:channelid": [
//                     "UCJU7oHhmt-EUa8KNfpuvDhA"
//                 ],
//                 "title": [
//                     "testvideo 1"
//                 ],
//                 "link": [
//                     {
//                         "$": {
//                             "rel": "alternate",
//                             "href": "https://www.youtube.com/watch?v=WbzYmskEgDE"
//                         }
//                     }
//                 ],
//                 "author": [
//                     {
//                         "name": [
//                             "Evan Coulson"
//                         ],
//                         "uri": [
//                             "https://www.youtube.com/channel/UCJU7oHhmt-EUa8KNfpuvDhA"
//                         ]
//                     }
//                 ],
//                 "published": [
//                     "2019-07-30T08:07:19+00:00"
//                 ],
//                 "updated": [
//                     "2019-07-30T08:07:48.581684321+00:00"
//                 ]
//             }
//         ]
//     }
// }