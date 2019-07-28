import YoutubeRequest from "./YoutubeRequest";
import IRequestBuilder from "../../TwitchWatcher/RequestBuilder/IRequestBuilder";

export default class GetChannelRequest extends YoutubeRequest {
    constructor(requestBuilder : IRequestBuilder, channelName : string) {
        super(getAPIURI(channelName), requestBuilder);
    }
}

function getAPIURI(channelName : string) : string {
    return `channels?part=snippet%2CcontentDetails%2Cstatistics&` +
            `forUsername=${channelName}&key=${process.env.YOUTUBE_API_KEY}`;
}