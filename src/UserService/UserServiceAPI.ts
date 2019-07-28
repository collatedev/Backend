import API from "../Service/API/API";
import UserRouter from "./Routes/UserRouter";
import ILogger from "../Logging/ILogger";
import IUserLayer from "./Layers/IUserLayer";

export default class UserServiceAPI extends API {
    constructor(userLayer : IUserLayer, logger : ILogger) {
        super();
        this.registerRoute(new UserRouter(userLayer, logger));
    }
}