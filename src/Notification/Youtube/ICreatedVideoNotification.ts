import INotification from "../INotification";

export default interface ICreatedVideoNotification extends INotification {
    videoID: string;
    channelID: string;
    title: string;
    link: string;
    datePublished : Date;
}