import Service from "./Service";

export default interface IWebhookInfo {
    expirationDate: Date;
    service: Service;
    topicURL: string;
    callbackURL: string;
}