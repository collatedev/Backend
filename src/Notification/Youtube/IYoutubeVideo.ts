import INotification from "../INotification";

export default interface IYoutubeVideo extends INotification {
    videoID: string;
    channelID: string;
    userID: string;
    title: string;
    link: string;
    datePublished : Date;
}