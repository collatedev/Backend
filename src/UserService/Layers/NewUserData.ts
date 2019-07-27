import INewUserData from "./INewUserData";

export default class NewUserData implements INewUserData {
    public readonly twitchUserID : number;
    public readonly youtubeChannelID : string;

    constructor(body : any) {
        this.twitchUserID = body.twitchUserID;
        this.youtubeChannelID = body.youtubeChannelID;
    }
}