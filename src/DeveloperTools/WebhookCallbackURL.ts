import Ngrok from "./Ngrok";

export default class WebhookCallbackURL {
    private static localhostCallbackURL: string = "https://localhost:8080/api/v1/";


    public static async getCallbackURL(path : string) : Promise<string> {
        if (process.env.NODE_ENV === 'production') {
            // BUG: This should be an env variable
            return `${this.localhostCallbackURL}/${path}`;
        } else if (process.env.NODE_ENV === 'test') {
            return "endpoint_url";
        } else {
            return `${await Ngrok.getURL()}/api/v1/${path}`;
        }
    }
}