export default interface ITwitchRequestBody {
    requiresAuthorization(): boolean;
    getScope(): string;
    getBody(): any;
}