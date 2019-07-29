import ITwitchRequest from "./ITwitchRequest";
import IWebhookInfo from "../../UserService/Models/IWebhookInfo";

export default interface ITwitchWebhookRequest extends ITwitchRequest {
    getWebhook() : IWebhookInfo;
}