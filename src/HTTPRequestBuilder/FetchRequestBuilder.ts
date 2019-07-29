import fetch, { RequestInit, Response } from "node-fetch";
import IHTTPRequestBuilder from "./IHTTPRequestBuilder";

export default class FetchRequestBuilder implements IHTTPRequestBuilder {
	public makeRequest(url: string, init: RequestInit): Promise<Response> {
		return fetch(url, init);
	}
}