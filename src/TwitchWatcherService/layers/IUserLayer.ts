import TwitchUser from "../schemas/user/TwitchUser";
import SubscriptionBody from "../schemas/request/SubscriptionBody";
import UnsubscriptionBody from "../schemas/request/UnsubscriptionBody";

export default interface IUserLayer {
    getUserInfo(id: number) : Promise<TwitchUser>;
    subscribe(subscriptionBody: SubscriptionBody) : Promise<TwitchUser>;
    unsubscribe(unsubscriptionBody: UnsubscriptionBody): Promise<TwitchUser>;
}