import IAuthorizedTopic from "./IAuthorizedTopic";

const AuthorizedTopics: { [id: string]: string[] } = {
    "user": ["user:read:email"]
};

const EmptyScope : string = "";

export default class AuthorizedTopic implements IAuthorizedTopic {
    private topic : string;

    constructor(topic : string) {
        this.topic = topic;
    }

    public isAuthorized() : boolean {
        return AuthorizedTopics.hasOwnProperty(this.topic);
    }

    public scope() : string {
        if (!this.isAuthorized()) {
            return EmptyScope;
        } else {
            return AuthorizedTopics[this.topic].join(" ").trim();
        }
    }
}