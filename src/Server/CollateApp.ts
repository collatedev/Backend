import App from "./App";
import TwitchWatcherService from "../TwitchWatcher/TwitchWatcherService";
import ILogger from "../Logging/ILogger";
import UserService from "../UserService/UserService";
import YoutubeWatcherService from "../YoutubeWatcher/YoutubeWatcherService";

export default class CollateApp extends App {
    constructor(logger : ILogger) {
        super(logger);
    }

    public initialize() : void {
        this.registerService(new TwitchWatcherService(this.logger));
        this.registerService(new UserService(this.logger));
        this.registerService(new YoutubeWatcherService(this.logger));
    }
}