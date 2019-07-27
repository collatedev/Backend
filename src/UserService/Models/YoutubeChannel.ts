import IYoutubeChannel from "./IYoutubeChannel";

export default class YoutubeChannel implements IYoutubeChannel {
    private id : string;

    constructor(id : string) {
        this.id = id;
    }

    public channelID() : string {
        return this.id;
    }
}