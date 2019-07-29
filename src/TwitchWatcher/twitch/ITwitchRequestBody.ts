export default interface ITwitchRequestBody {
    requiresAuthorization(): boolean;
    getURL(): string;
    getScope(): string[];
    getBody(): any;
    getMethod() : string;
}