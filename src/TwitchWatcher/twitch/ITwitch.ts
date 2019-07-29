import ITwitchUser from "../../UserService/Models/ITwitchUser";

export default interface ITwitch {
    getUser(userName : string) : Promise<ITwitchUser>;
    subscribe(user : ITwitchUser) : Promise<void>;
    unsubscribe(user: ITwitchUser) : Promise<void>;
}