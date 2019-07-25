import IMessage from "./IMessage";

export default class Message implements IMessage {
	public readonly success : boolean;
	public readonly data : any;
	
	constructor(success: boolean, data : any) {
		this.success = success;
	}
}