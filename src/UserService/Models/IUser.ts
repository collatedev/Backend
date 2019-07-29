import ITwitchUser from './ITwitchUser';
import IYoutubeChannel from './IYoutubeChannel';
import { Document } from "mongoose";
import IWebhookInfo from './IWebhookInfo';

export default interface IUser extends Document {
    twitchID : number;
    youtubeChannel : IYoutubeChannel;
    webhooks: IWebhookInfo[];
    getTwitchUser() : ITwitchUser;
}