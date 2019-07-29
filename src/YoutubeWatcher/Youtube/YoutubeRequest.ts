import IYoutubeRequest from "./IYoutubeRequest";
import { Response } from "node-fetch";
import Path from "path";
import IHTTPRequestBuilder from "../../HTTPRequestBuilder/IHTTPRequestBuilder";
import FetchRequestBuilder from "../../HTTPRequestBuilder/FetchRequestBuilder";

const YoutubeBaseAPIURL : string = "www.googleapis.com/youtube/v3/";

export default abstract class YoutubeRequest implements IYoutubeRequest {
    private url : string;
    private requestBuilder : IHTTPRequestBuilder;

    constructor(url : string) {
        this.url = `https://${Path.join(YoutubeBaseAPIURL, url)}`;
        this.requestBuilder = new FetchRequestBuilder();
    }

    public async send() : Promise<Response> {
        return this.requestBuilder.makeRequest(this.url, {
            method: "GET"
        }).catch((error : Error) => {
            throw error;
        });
    }
}