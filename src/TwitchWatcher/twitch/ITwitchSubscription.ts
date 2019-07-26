export default interface ITwitchSubscription {
    mode() : string;
    userID() : number;
    topic() : string;
    callbackURL() : string;
    setMode(mode : string) : void;
}