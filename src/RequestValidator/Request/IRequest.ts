import IRequestMapping from "./IRequestMapping";

export default interface IRequest {
    getRequest() : IRequestMapping;
    toJson() : any;
}