import ISubscriptionBody from "./ISubscriptionBody";
import ITwitchBody from "./ITwitchBody";

export default class SubscriptionBody implements ISubscriptionBody, ITwitchBody {
	public readonly userID: number;

	constructor(body: any) {
		this.userID = body.userID;
	}
}