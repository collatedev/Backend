import TwitchWatcherAPI from "./TwitchWatcherAPI";
import ILogger from "../Logging/ILogger";
import Service from "../Service/Service";

export default class TwitchWatcherService extends Service {
    constructor(logger : ILogger) {
        super();
        this.registerAPI(new TwitchWatcherAPI(logger));
    }
}