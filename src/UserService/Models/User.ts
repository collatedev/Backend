import IUser from "./IUser";
import ITwitchUser from "./ITwitchUser";
import TwitchUser from "./TwitchUser";
import IYoutubeChannel from "./IYoutubeChannel";

export default class User implements IUser {
    private id : number;
    private twitchUser : ITwitchUser;
    private youtubeChannel : IYoutubeChannel;

    constructor(id : number, twitchID : number, channel : IYoutubeChannel) {
        this.id = id;
        this.twitchUser = new TwitchUser(twitchID);
        this.youtubeChannel = channel;
    }

    public getID() : number {
        return this.id;
    }

    public getTwitchUser() : ITwitchUser {
        return this.twitchUser;
    }

    public getYoutubeChannel() : IYoutubeChannel {
        return this.youtubeChannel;
    }
}