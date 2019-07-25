import ITwitchResponse from "./ITwitchResponse";

export default interface ITwitchRequest {
	send() : Promise<ITwitchResponse>;
}