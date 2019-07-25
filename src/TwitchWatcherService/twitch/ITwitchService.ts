import SubscriptionBody from "../schemas/request/SubscriptionBody";

export default interface ITwitchService {
    subscribe(body: SubscriptionBody) : Promise<void>;
}