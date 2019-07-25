import Ngrok from "../developer_tools/Ngrok";

export default class TwitchCallbackURL {
    private static localhostCallbackURL: string = "https://localhost:8080/api/v1/topic";


    public static async getCallbackURL() : Promise<string> {
        if (process.env.NODE_ENV === 'production') {
            return this.localhostCallbackURL;
        } else if (process.env.NODE_ENV === 'test') {
            return "endpoint_url";
        } else {
            return `${await Ngrok.getURL()}/api/v1/topic`;
        }
    }
}