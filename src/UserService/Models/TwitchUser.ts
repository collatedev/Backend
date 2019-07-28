import ITwitchUser from "./ITwitchUser";

export default class TwitchUser implements ITwitchUser {
    private id : number;

    constructor(id : number) {
        this.id = id;
    }

    public userID() : number {
        return this.id;
    }
}