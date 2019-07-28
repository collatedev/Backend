import IYoutube from "../../src/YoutubeWatcher/Youtube/IYoutube";
import IYoutubeChannel from "../../src/UserService/models/IYoutubeChannel";
import YoutubeChannel from "../../src/UserService/Models/YoutubeChannel";

export default class MockYoutubeService implements IYoutube {
    public async getChannel(name: string): Promise<IYoutubeChannel> {
        return Promise.resolve(new YoutubeChannel("foo", {
            items: [
                {id: 0}
            ]
        }));
    }

    public async subscribeToPushNotifications(youtubeChannel: IYoutubeChannel): Promise<void> {
        return Promise.resolve();
    }
}