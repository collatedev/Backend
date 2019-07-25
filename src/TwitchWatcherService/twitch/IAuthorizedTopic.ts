export default interface IAuthorizedTopic {
    isAuthorized() : boolean;
    scope() : string;
}