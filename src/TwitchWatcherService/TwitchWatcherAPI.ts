import NewFollowerRouter from "./routes/NewFollowerRouter";
import StreamRouter from "./routes/StreamRouter";
import SubscriptionRouter from "./routes/SubscriptionRouter";
import UserLayer from "./layers/UserLayer";
import TwitchProfileUpdateRouter from "./routes/TwitchProfileUpdateRouter";
import UserFollowedRouter from "./routes/UserFollowedRouter";
import UserRouter from "./routes/UserRouter";
import IUserLayer from "./layers/IUserLayer";
import UserModel from "./models/UserModel";
import ITwitchService from "./twitch/ITwitchService";
import TwitchService from "./twitch/TwitchService";
import FetchRequestBuilder from "./request_builder/FetchRequestBuilder";
import SecretGenerator from "./twitch/SecretGenerator";
import API from "../Service/API/API";
import ILogger from "../Logging/ILogger";

export default class TwitchWatcherAPI extends API {
    constructor(logger : ILogger) {
        super();
        const twitch : ITwitchService = new TwitchService(new FetchRequestBuilder(), new SecretGenerator(), logger);
        const userLayer : IUserLayer = new UserLayer(new UserModel(), twitch);

        this.registerRoute(new NewFollowerRouter(logger));
        this.registerRoute(new StreamRouter(logger));
        this.registerRoute(new SubscriptionRouter(userLayer, logger));
        this.registerRoute(new TwitchProfileUpdateRouter(logger));
        this.registerRoute(new UserFollowedRouter(logger));
        this.registerRoute(new UserRouter(userLayer, logger));
    }
}