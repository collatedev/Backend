import IStreamBody from "./IStreamBody";
import IStreamData from "./IStreamData";

export default class StreamBody implements IStreamBody {
	public readonly data: IStreamData[];

	constructor(body: any) {
		this.data = body.data;
	}
}