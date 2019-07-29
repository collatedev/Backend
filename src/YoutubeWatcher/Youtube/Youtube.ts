import IYoutube from "./IYoutube";
import IYoutubeChannel from "../../UserService/Models/IYoutubeChannel";
import IYoutubeRequest from "./IYoutubeRequest";
import GetChannelRequest from "./GetChannelRequest";
import IHTTPRequestBuilder from "../../HTTPRequestBuilder/IHTTPRequestBuilder";
import YoutubeChannel from "../../UserService/Models/YoutubeChannel";
import { Response } from "node-fetch";
import YoutubeWebhookBody from "../Webhook/YoutubeWebhookBody";
import WebhookCallbackURL from "../../DeveloperTools/WebhookCallbackURL";
import GetChannelByIDRequest from "./GetChannelByIDRequest";
import FetchRequestBuilder from "../../HTTPRequestBuilder/FetchRequestBuilder";
import IWebhookInfo from "../../UserService/Models/IWebhookInfo";
import WebhookInfo from "../../UserService/Models/WebhookInfo";
import Service from "../../UserService/Models/Service";

const YoutubeHubURL : string = "https://pubsubhubbub.appspot.com/subscribe";

export default class Youtube implements IYoutube {
    private requestBuilder : IHTTPRequestBuilder;

    constructor() {
        this.requestBuilder = new FetchRequestBuilder();
    }

    public async getChannel(name : string) : Promise<IYoutubeChannel> {
        let request : IYoutubeRequest = new GetChannelRequest(name);
        let response : Response = await request.send();
        let payload : any = await response.json();
        if (payload.items.length === 0) {
            request = new GetChannelByIDRequest(name); 
            response = await request.send();
            payload = await response.json();
            if (payload.items.length === 0) {
                throw new Error(`Could not find a youtube channel by name or id of "${name}"`);
            }
            return new YoutubeChannel(payload.items[0].snippet.title, payload);
        }
        return new YoutubeChannel(name, payload);
    }

    public async subscribeToPushNotifications(channel : IYoutubeChannel) : Promise<IWebhookInfo> {
        const callbackURL : string = await WebhookCallbackURL.getCallbackURL("youtube");
        const body : YoutubeWebhookBody  = new YoutubeWebhookBody("subscribe", callbackURL, channel.youtubeID);
        await this.requestBuilder.makeRequest(YoutubeHubURL, {
            method: "POST",
            body: body.getBody()
        });
        return new WebhookInfo(Service.Youtube, callbackURL, body.getTopic());
    }
}