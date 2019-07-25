import SubscriptionBody from "../schemas/request/SubscriptionBody";
import TwitchUser from "../schemas/user/TwitchUser";
import UnsubscriptionBody from "../schemas/request/IUnsubscriptionBody";
import IUserLayer from "./IUserLayer";
import IUserModel from "../models/IUserModel";
import ITwitchService from "../twitch/ITwitchService";

export default class UserLayer implements IUserLayer {
    private userModel: IUserModel;
    private twitch : ITwitchService; 

    constructor(userModel: IUserModel, twitch : ITwitchService) {
        this.userModel = userModel;
        this.twitch = twitch;
    }

    public async getUserInfo(id: number) : Promise<TwitchUser> {
        try {
            return await this.userModel.getByID(id);
        } catch (exception) {
            throw new Error(`Failed to find a user with the id: ${id}`);
        }   
    }

    public async subscribe(subscriptionBody: SubscriptionBody) : Promise<TwitchUser> {
		const user : TwitchUser = await this.userModel.getByID(subscriptionBody.userID); // should be the user service library
		await this.twitch.subscribe(subscriptionBody);
        return user;
	}

    public async unsubscribe(unsubscriptionBody: UnsubscriptionBody): Promise<TwitchUser> {
        const user : TwitchUser = await this.userModel.getByID(unsubscriptionBody.userID);
        return user;
    }
}