import IRequest from "./IRequest";
import IRequestMapping from "./IRequestMapping";
import RequestMapping from "./RequestMapping";

export default class Validatable implements IRequest {
    private readonly object : any;

    constructor(object: any) {
        this.object = object;
    }

    public getRequest() : IRequestMapping {
        return new RequestMapping(this.object);
    }

    public toJson() : any {
        return this.object;
    }
}