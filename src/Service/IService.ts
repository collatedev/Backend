import IAPI from "./API/IAPI";

export default interface IService {
    getAPIs() : IAPI[];
    registerAPI(api : IAPI) : void;
}