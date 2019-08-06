import Service from "../Service/Service";
import ILogger from "../Logging/ILogger";
import FeedAPI from "./FeedAPI";

export default class FeedService extends Service {
    constructor(logger : ILogger) {
        super();
        this.registerAPI(new FeedAPI(logger));
    }
}