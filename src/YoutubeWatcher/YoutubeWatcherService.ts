import Service from "../Service/Service";
import ILogger from "../Logging/ILogger";
import YoutubeWatcherAPI from "./YoutubeWatcherAPI";

export default class YoutubeWatcherService extends Service {
    constructor(logger : ILogger) {
        super();
        this.registerAPI(new YoutubeWatcherAPI(logger));
    }
}