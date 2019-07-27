import TwitchWebhook from "./TwitchWebhook";

export default class TwitchUser {
    public id: number;
    public streamHook: TwitchWebhook | null;
    public userHook: TwitchWebhook | null;
    public followerHook: TwitchWebhook | null;

    constructor(id: number) {
        this.id = id;
        this.streamHook = null;
        this.userHook = null;
        this.followerHook = null;
    }
}