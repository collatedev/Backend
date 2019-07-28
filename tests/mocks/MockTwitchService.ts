import ITwitchService from "../../src/TwitchWatcher/Twitch/ITwitchService";

export default class MockTwitchService implements ITwitchService {
    public async subscribe(userID: number): Promise<void> {
        return Promise.resolve();
    }

    public async unsubscribe(userID: number): Promise<void> {
        return Promise.resolve();
    }
}