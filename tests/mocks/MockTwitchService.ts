import ITwitchService from "../../src/TwitchWatcherService/twitch/ITwitchService";
import SubscriptionBody from "../../src/TwitchWatcherService/schemas/request/SubscriptionBody";

export default class MockTwitchService implements ITwitchService {
    public async subscribe(body: SubscriptionBody): Promise<void> {
        return new Promise((resolve : () => void) : void => {
            return resolve();
        });
    }

}