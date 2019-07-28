import YoutubeRequest from "../../src/YoutubeWatcher/Youtube/YoutubeRequest";
import IRequestBuilder from "../../src/TwitchWatcher/RequestBuilder/IRequestBuilder";

export default class MockYoutubeRequest extends YoutubeRequest {
    constructor(requestBuilder : IRequestBuilder) {
        super("test", requestBuilder);
    }
}