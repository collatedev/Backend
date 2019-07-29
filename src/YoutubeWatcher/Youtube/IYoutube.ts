import IYoutubeChannel from "../../UserService/Models/IYoutubeChannel";
import IWebhookInfo from "../../UserService/Models/IWebhookInfo";

export default interface IYoutube {
    getChannel(name : string) : Promise<IYoutubeChannel>;
    subscribeToPushNotifications(youtubeChannel : IYoutubeChannel) : Promise<IWebhookInfo>;
}