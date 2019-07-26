import SubscriptionBody from "../schemas/request/SubscriptionBody";
import UnsubscriptionBody from "../schemas/request/UnsubscriptionBody";

export default interface ITwitchService {
    subscribe(body: SubscriptionBody) : Promise<void>;
    unsubscribe(body: UnsubscriptionBody) : Promise<void>;
}