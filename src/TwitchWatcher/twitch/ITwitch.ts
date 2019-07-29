import ITwitchUser from "../../UserService/Models/ITwitchUser";
import IWebhookInfo from "../../UserService/Models/IWebhookInfo";

export default interface ITwitch {
    getUser(userName : string) : Promise<ITwitchUser>;
    subscribe(user : ITwitchUser) : Promise<IWebhookInfo[]>;
    unsubscribe(user: ITwitchUser) : Promise<IWebhookInfo[]>;
}