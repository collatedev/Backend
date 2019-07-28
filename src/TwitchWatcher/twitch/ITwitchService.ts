export default interface ITwitchService {
    subscribe(userID : number) : Promise<void>;
    unsubscribe(userID: number) : Promise<void>;
}