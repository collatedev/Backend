import ITwitchProfileUpdateBody from "./ITwitchProfileUpdateBody";
import ITwitchProfileUpdateData from "./ITwitchProfileUpdateData";

export default class TwitchProfileUpdateBody implements ITwitchProfileUpdateBody {
	public readonly data: ITwitchProfileUpdateData[];

	constructor(body: any) {
		this.data = body.data;
	}
}