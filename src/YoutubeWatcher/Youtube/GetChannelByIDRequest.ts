import YoutubeRequest from "./YoutubeRequest";

export default class GetChannelByIDRequest extends YoutubeRequest {
    constructor(channelID : string) {
        super(getAPIURI(channelID));
    }
}

function getAPIURI(channelID : string) : string {
    return `channels?part=snippet%2CcontentDetails%2Cstatistics&` +
            `id=${channelID}&key=${process.env.YOUTUBE_API_KEY}`;
}