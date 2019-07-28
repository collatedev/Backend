import NewFollowerRouter from "./Routes/NewFollowerRouter";
import StreamRouter from "./Routes/StreamRouter";
import TwitchProfileUpdateRouter from "./Routes/TwitchProfileUpdateRouter";
import UserFollowedRouter from "./Routes/UserFollowedRouter";
import API from "../Service/API/API";
import ILogger from "../Logging/ILogger";

export default class TwitchWatcherAPI extends API {
    constructor(logger : ILogger) {
        super();

        this.registerRoute(new NewFollowerRouter(logger));
        this.registerRoute(new StreamRouter(logger));
        this.registerRoute(new TwitchProfileUpdateRouter(logger));
        this.registerRoute(new UserFollowedRouter(logger));
    }
}