import Service from "../Service/Service";
import ILogger from "../Logging/ILogger";
import IUserLayer from "./Layers/IUserLayer";
import UserLayer from "./Layers/UserLayer";
import UserModel from "./Models/UserModel";
import TwitchService from "../TwitchWatcher/Twitch/TwitchService";
import FetchRequestBuilder from "../TwitchWatcher/RequestBuilder/FetchRequestBuilder";
import SecretGenerator from "../TwitchWatcher/Twitch/SecretGenerator";
import UserServiceAPI from "./UserServiceAPI";
import Youtube from "../YoutubeWatcher/Youtube/Youtube";

export default class UserService extends Service {
    constructor(logger : ILogger) {
        super();
        const userLayer : IUserLayer = new UserLayer(
            new UserModel(), 
            new TwitchService(new FetchRequestBuilder(), new SecretGenerator(), logger),
            new Youtube()
        );

        this.registerAPI(new UserServiceAPI(userLayer, logger));
    }
}