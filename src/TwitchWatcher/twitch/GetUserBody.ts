import ITwitchRequestBody from "./ITwitchRequestBody";

export default class GetUserBody implements ITwitchRequestBody {
    private userName : string;

    constructor(userName : string) {
        this.userName = userName;
    }

    public getMethod() : string {
        return "GET";
    }

    public getScope() : string[] {
        return [];
    }

    public getBody() : any {
        return null;
    }

    public getURL() : string {
        return `https://api.twitch.tv/helix/users?login=${this.userName}`;
    }

    public requiresAuthorization() : boolean {
        return false;
    }
}