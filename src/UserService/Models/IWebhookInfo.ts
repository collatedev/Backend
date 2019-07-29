export default interface IWebhookInfo {
    expirationDate: Date;
    service: string;
    topicURL: string;
    callbackURL: string;
}