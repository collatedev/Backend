import IService from "../Service/IService";

export default interface IApp {
    initialize() : void;
    start(port : number) : void;
    registerService(service : IService) : void;
}