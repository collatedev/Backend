import IService from "./IService";
import IAPI from "./API/IAPI";

export default abstract class Service implements IService {
    private readonly apis : IAPI[];

    constructor() {
        this.apis = [];
    }

    public getAPIs() : IAPI[] {
        return this.apis;
    }

    public registerAPI(api : IAPI) : void {
        this.apis.push(api);
    }
}