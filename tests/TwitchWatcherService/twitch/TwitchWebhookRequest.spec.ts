import TwitchWebhookRequest from "../../../src/TwitchWatcher/Twitch/TwitchWebhookRequest";
import TwitchSubscription from "../../../src/TwitchWatcher/Twitch/TwitchSubscription";
import MockTwitchWebhookRequest from "../../mocks/MockTwitchWebhookRequest";
import TwitchWebhookRequestBody from "../../../src/TwitchWatcher/Twitch/TwitchWebhookRequestBody";
import ITwitchSubscription from "../../../src/TwitchWatcher/Twitch/ITwitchSubscription";
import IWebhookInfo from "../../../src/UserService/Models/IWebhookInfo";
import Service from "../../../src/UserService/Models/Service";

test("Should get webhook", () => {
    const subscription : ITwitchSubscription = new TwitchSubscription(0, "streams", "baz");
    subscription.setMode("subscribe");
    const webhookRequest : TwitchWebhookRequest = new MockTwitchWebhookRequest(
        new TwitchWebhookRequestBody(subscription)
    );

    const webhook : IWebhookInfo = webhookRequest.getWebhook();
    expect(webhook).toMatchObject({
        expirationDate : expect.any(Date),
        callbackURL: "baz/streams",
        topicURL: "https://api.twitch.tv/helix/streams?user_id=0",
        service: Service.Twitch
    });
});