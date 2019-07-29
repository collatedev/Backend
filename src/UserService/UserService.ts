import Service from "../Service/Service";
import ILogger from "../Logging/ILogger";
import IUserLayer from "./Layers/IUserLayer";
import UserLayer from "./Layers/UserLayer";
import TwitchService from "../TwitchWatcher/Twitch/TwitchService";
import UserServiceAPI from "./UserServiceAPI";
import Youtube from "../YoutubeWatcher/Youtube/Youtube";

export default class UserService extends Service {
    constructor(logger : ILogger) {
        super();
        const userLayer : IUserLayer = new UserLayer(
            new TwitchService(logger),
            new Youtube()
        );

        this.registerAPI(new UserServiceAPI(userLayer, logger));
    }
}