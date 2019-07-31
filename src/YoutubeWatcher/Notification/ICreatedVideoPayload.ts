export default interface ICreatedVideoPayload {
    channelID() : string;
    datePublished() : Date;
    link() : string;
    title() : string;
    videoID() : string;
}