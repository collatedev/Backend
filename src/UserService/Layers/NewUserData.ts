import INewUserData from "./INewUserData";

export default class NewUserData implements INewUserData {
    public readonly twitchUserName : string;
    public readonly youtubeChannelName : string;

    constructor(body : any) {
        this.twitchUserName = body.twitchUserName;
        this.youtubeChannelName = body.youtubeChannelName;
    }
}