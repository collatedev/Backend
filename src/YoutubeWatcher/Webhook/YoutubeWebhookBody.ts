import FormData from "form-data";

const LeaseSeconds : number = 300; // 5 minutes

export default class YoutubeWebhookBody {
    private mode : string;
    private callbackURL : string;
    private channelID : string;

    constructor(mode : string, callbackURL : string, channelID : string) {
        this.mode = mode;
        this.callbackURL = callbackURL;
        this.channelID = channelID;
    }

    public getBody() : FormData {
        const form : FormData = new FormData();
        form.append("hub.mode", this.mode);
        form.append("hub.callback", this.callbackURL);
        form.append("hub.topic", `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${this.channelID}`);
        form.append("hub.lease_seconds", LeaseSeconds);
        return form;
    }
}