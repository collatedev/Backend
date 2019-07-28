import API from "../Service/API/API";
import ILogger from "../Logging/ILogger";
import CallbackRouter from "./Routes/CallbackRouter";

export default class YoutubeWatcherAPI extends API {
    constructor(logger : ILogger) {
        super();
        this.registerRoute(new CallbackRouter(logger));
    }
}