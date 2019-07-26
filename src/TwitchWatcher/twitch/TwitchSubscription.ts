import ITwitchBody from "../schemas/request/ITwitchBody";
import ITwitchSubscription from './ITwitchSubscription';

export default class TwitchSubscription implements ITwitchSubscription {
	private _mode: string;
	private _userID: number;
	private _topic: string;
	private _callbackURL: string;

	constructor(body: ITwitchBody, topic: string, callbackURL: string) {
		this._mode = "";
		this._topic = topic;
		this._userID = body.userID;
		this._callbackURL = callbackURL;
	}

	public mode() : string {
		return this._mode;
	}

	public setMode(mode : string) : void {
		this._mode = mode;
	}

	public topic() : string {
		return this._topic;
	}

	public userID() : number {
		return this._userID;
	}

	public callbackURL() : string {
		return this._callbackURL;
	}
}