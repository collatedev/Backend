import Service from "../Service/Service";
import ILogger from "../Logging/ILogger";
import IUserLayer from "./Layers/IUserLayer";
import UserLayer from "./Layers/UserLayer";
import Twitch from "../TwitchWatcher/Twitch/Twitch";
import UserServiceAPI from "./UserServiceAPI";
import Youtube from "../YoutubeWatcher/Youtube/Youtube";

export default class UserService extends Service {
    constructor(logger : ILogger) {
        super();
        const userLayer : IUserLayer = new UserLayer(
            new Twitch(logger),
            new Youtube()
        );

        this.registerAPI(new UserServiceAPI(userLayer, logger));
    }
}