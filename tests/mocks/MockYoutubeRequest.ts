import YoutubeRequest from "../../src/YoutubeWatcher/Youtube/YoutubeRequest";

export default class MockYoutubeRequest extends YoutubeRequest {
    constructor() {
        super("test");
    }
}