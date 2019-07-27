import IUser from "./IUser";
import ITwitchUser from "./ITwitchUser";
import TwitchUser from "./TwitchUser";
import IYoutubeChannel from "./IYoutubeChannel";
import YoutubeChannel from "./YoutubeChannel";
import INewUserData from "../Layers/INewUserData";

export default class User implements IUser {
    private id : number;
    private twitchUser : ITwitchUser;
    private youtubeChannel : IYoutubeChannel;

    constructor(newUserData : INewUserData, id : number) {
        this.id = id;
        this.twitchUser = new TwitchUser(newUserData.twitchUserID);
        this.youtubeChannel = new YoutubeChannel(newUserData.youtubeChannelID);
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