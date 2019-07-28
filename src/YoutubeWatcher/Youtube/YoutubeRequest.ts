import IYoutubeRequest from "./IYoutubeRequest";
import { Response } from "node-fetch";
import Path from "path";
import IRequestBuilder from "../../TwitchWatcher/RequestBuilder/IRequestBuilder";

const YoutubeBaseAPIURL : string = "www.googleapis.com/youtube/v3/";

export default abstract class YoutubeRequest implements IYoutubeRequest {
    private url : string;
    private requestBuilder : IRequestBuilder;

    constructor(url : string, requestBuilder : IRequestBuilder) {
        this.url = `https://${Path.join(YoutubeBaseAPIURL, url)}`;
        this.requestBuilder = requestBuilder;
    }

    public async send() : Promise<Response> {
        return this.requestBuilder.makeRequest(this.url, {
            method: "GET"
        }).catch((error : Error) => {
            throw error;
        });
    }
}