export default interface ITwitch {
    subscribe(userID : number) : Promise<void>;
    unsubscribe(userID: number) : Promise<void>;
}