import YoutubeRequest from "./YoutubeRequest";
import IRequestBuilder from "../../TwitchWatcher/RequestBuilder/IRequestBuilder";

export default class GetChannelByIDRequest extends YoutubeRequest {
    constructor(requestBuilder : IRequestBuilder, channelID : string) {
        super(getAPIURI(channelID), requestBuilder);
    }
}

function getAPIURI(channelID : string) : string {
    return `channels?part=snippet%2CcontentDetails%2Cstatistics&` +
            `id=${channelID}&key=${process.env.YOUTUBE_API_KEY}`;
}