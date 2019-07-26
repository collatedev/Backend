export default class TwitchWebhook {
    public callbackURL: string;
    public topicURL: string;
    public expirationDate: Date | null;

    constructor(callbackURL: string, topicURL: string, expirationDate: Date | null) {
        this.callbackURL = callbackURL;
        this.topicURL = topicURL;
        this.expirationDate = expirationDate;
    }
}