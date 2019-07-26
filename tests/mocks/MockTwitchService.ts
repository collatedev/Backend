import ITwitchService from "../../src/TwitchWatcher/twitch/ITwitchService";
import SubscriptionBody from "../../src/TwitchWatcher/schemas/request/SubscriptionBody";

export default class MockTwitchService implements ITwitchService {
    public async subscribe(body: SubscriptionBody): Promise<void> {
        return new Promise((resolve : () => void) : void => {
            return resolve();
        });
    }

    public async unsubscribe(body: SubscriptionBody): Promise<void> {
        return new Promise((resolve : () => void) : void => {
            return resolve();
        });
    }
}