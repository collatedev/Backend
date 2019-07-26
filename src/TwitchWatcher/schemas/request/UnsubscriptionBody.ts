import IUnsubscriptionBody from "./IUnsubscriptionBody";
import ITwitchBody from "./ITwitchBody";

export default class UnsubscriptionBody implements IUnsubscriptionBody, ITwitchBody {
	public readonly userID: number;

	constructor(body: any) {
		this.userID = body.userID;
	}
}