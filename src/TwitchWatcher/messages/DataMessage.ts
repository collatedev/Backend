import Message from "../../Router/Messages/Message";

export default class DataMessage extends Message {
	constructor(data: object) {
		super(true, data);
	}
}