import TwitchRequest from "./TwitchRequest";
import GetUserBody from "./GetUserBody";

export default class GetUserRequest extends TwitchRequest {
    constructor(userName : string) {
        super(new GetUserBody(userName));
    }
}