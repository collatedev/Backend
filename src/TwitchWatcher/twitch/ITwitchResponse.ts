import { Response, RequestInit } from "node-fetch";

export default interface ITwitchResponse {
	response(): Response;
	request(): RequestInit;
	status(): number;
}