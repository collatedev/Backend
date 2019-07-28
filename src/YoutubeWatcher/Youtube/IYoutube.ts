import IYoutubeChannel from "../../UserService/models/IYoutubeChannel";

export default interface IYoutube {
    getChannel(name : string) : Promise<IYoutubeChannel>;
    subscribeToPushNotifications(youtubeChannel : IYoutubeChannel) : Promise<void>;
}