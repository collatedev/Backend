import IRouter from "../../Router/IRouter";

export default interface IAPI {
    getRoutes() : IRouter[];
    registerRoute(route : IRouter) : void;
}