import IUserLayer from "../../src/TwitchWatcher/layers/IUserLayer";
import IUserModel from "../../src/TwitchWatcher/models/IUserModel";
import MockUserModel from "./MockUserModel";
import TwitchUser from "../../src/TwitchWatcher/schemas/user/TwitchUser";
import SubscriptionBody from "../../src/TwitchWatcher/schemas/request/SubscriptionBody";
import UnsubscriptionBody from "../../src/TwitchWatcher/schemas/request/UnsubscriptionBody";

export default class MockUserLayer implements IUserLayer {
    private userModel : IUserModel;

    constructor(userModel: MockUserModel) {
        this.userModel = userModel;
    }

    public async getUserInfo(id: number) : Promise<TwitchUser> {
        return this.userModel.getByID(id);
    }

    public async subscribe(subscriptionBody: SubscriptionBody) : Promise<TwitchUser> {
        const userModel : TwitchUser = await this.userModel.getByID(subscriptionBody.userID);
        return userModel;
    }

    public async unsubscribe(unsubscriptionBody: UnsubscriptionBody) : Promise<TwitchUser> {
        const userModel : TwitchUser = await this.userModel.getByID(unsubscriptionBody.userID);
        return userModel;
    }
}