import Message from "./Message";

export default class DataMessage extends Message {
	constructor(data: object) {
		super(true, data);
	}
}