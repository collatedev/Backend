import INewUserData from "./INewUserData";

export default class NewUserData implements INewUserData {
    public readonly twitchUserID : number;
    public readonly youtubeChannelName : string;

    constructor(body : any) {
        this.twitchUserID = body.twitchUserID;
        this.youtubeChannelName = body.youtubeChannelName;
    }
}