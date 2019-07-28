import IFollowData from "./IFollowData";
import IFollowBody from "./IFollowBody";

export default class FollowBody implements IFollowBody {
	public readonly data: IFollowData[];

	constructor(body: any) {
		this.data = body.data;
	}
}