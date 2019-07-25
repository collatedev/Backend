import ITwitchResponse from "./ITwitchResponse";
import { Response, RequestInit } from "node-fetch";

export default class TwitchResponse implements ITwitchResponse {
	private readonly _status: number;
	private readonly _response: Response;
	private readonly _request: RequestInit;

	constructor(request: RequestInit, HTTPResponse: Response) {
		this._request = request;
		this._status = HTTPResponse.status;
		this._response = HTTPResponse;
	}

	public request() : RequestInit {
		return this._request;
	}

	public response() : Response {
		return this._response;
	}

	public status() : number {
		return this._status;
	}
}