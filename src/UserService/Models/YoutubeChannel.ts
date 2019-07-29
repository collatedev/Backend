import IYoutubeChannel from "./IYoutubeChannel";

export default class YoutubeChannel implements IYoutubeChannel {
    public readonly channelName : string;
    public readonly youtubeID : string;
    public readonly title : string;

    constructor(name : string, payload : any) {
        this.channelName = name;
        this.youtubeID = payload.items[0].id;
        this.title = payload.items[0].snippet.title;
    }
}