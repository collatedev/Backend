import YoutubeRequest from "./YoutubeRequest";

export default class GetChannelRequest extends YoutubeRequest {
    constructor(channelName : string) {
        super(getAPIURI(channelName));
    }
}

function getAPIURI(channelName : string) : string {
    return `channels?part=snippet%2CcontentDetails%2Cstatistics&` +
            `forUsername=${channelName}&key=${process.env.YOUTUBE_API_KEY}`;
}