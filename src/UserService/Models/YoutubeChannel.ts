import IYoutubeChannel from "./IYoutubeChannel";

export default class YoutubeChannel implements IYoutubeChannel {
    private name : string;
    private id : string;

    constructor(name : string, payload : any) {
        this.name = name;
        this.id = payload.items[0].id;
    }

    public channelName() : string {
        return this.name;
    }

    public getID() : string {
        return this.id;
    }
}