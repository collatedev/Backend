import API from "../Service/API/API";
import FeedRouter from "./route/FeedRouter";
import ILogger from "../Logging/ILogger";

export default class FeedAPI extends API {
    constructor(logger : ILogger) {
        super();
        this.registerRoute(new FeedRouter(logger));
    }
}