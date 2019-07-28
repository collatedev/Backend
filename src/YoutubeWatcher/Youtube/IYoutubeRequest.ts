import { Response } from "node-fetch";

export default interface IYoutubeRequest {
    send() : Promise<Response>;
}