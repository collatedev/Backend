import IWebhookInfo from "./IWebhookInfo";

export default class WebhookInfo implements IWebhookInfo {
    public readonly expirationDate : Date;
    public readonly service : string;
    public readonly callbackURL : string;
    public readonly topicURL : string;

    constructor(service : string, callbackURL : string, topicURL : string) {
        this.expirationDate = new Date();
        this.service = service;
        this.callbackURL = callbackURL;
        this.topicURL = topicURL;
    }
}