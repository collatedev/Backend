import { RequestInit, Response } from "node-fetch";

export default interface IHTTPRequestBuilder {
	makeRequest(url: string, options: RequestInit): Promise<Response>;
}