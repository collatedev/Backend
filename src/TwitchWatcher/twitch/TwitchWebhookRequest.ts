import ITwitchWebhookRequest from "./ITwitchWebhookRequest";
import TwitchRequest from "./TwitchRequest";
import TwitchWebhookRequestBody from "./TwitchWebhookRequestBody";
import IWebhookInfo from "../../UserService/Models/IWebhookInfo";
import WebhookInfo from "../../UserService/Models/WebhookInfo";
import Service from "../../UserService/Models/Service";

export default abstract class TwitchWebhookRequest extends TwitchRequest implements ITwitchWebhookRequest {
    private subscriptionBody : TwitchWebhookRequestBody;

    constructor(subscriptionBody : TwitchWebhookRequestBody) {
        super(subscriptionBody);
        this.subscriptionBody = subscriptionBody;
    }

    public getWebhook() : IWebhookInfo {
        return new WebhookInfo(
            Service.Twitch, 
            this.subscriptionBody["hub.callback"], 
            this.subscriptionBody["hub.topic"]
        );
    }
}