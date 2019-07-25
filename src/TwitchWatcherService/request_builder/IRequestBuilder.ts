import { RequestInit, Response } from "node-fetch";

export default interface IRequestBuilder {
	makeRequest(url: string, options: RequestInit): Promise<Response>;
}