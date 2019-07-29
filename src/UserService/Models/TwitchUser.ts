import ITwitchUser from "./ITwitchUser";

export default class TwitchUser implements ITwitchUser {
    public readonly userID : number;

    constructor(userID : number) {
        this.userID = userID;
    }
}