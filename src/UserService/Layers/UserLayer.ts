import IUserLayer from "./IUserLayer";
import IUserModel from "../models/IUserModel";
import ITwitchService from "../../TwitchWatcher/Twitch/ITwitchService";
import IUser from "../models/IUser";
import INewUserData from "./INewUserData";
import IYoutube from "../../YoutubeWatcher/Youtube/IYoutube";
import IYoutubeChannel from "../models/IYoutubeChannel";

export default class UserLayer implements IUserLayer {
    private userModel: IUserModel;
    private twitch : ITwitchService;
    private youtube : IYoutube;

    constructor(userModel: IUserModel, twitch : ITwitchService, youtube : IYoutube) {
        this.userModel = userModel;
        this.twitch = twitch;
        this.youtube = youtube;
    }

    public async getUserInfo(id: number) : Promise<IUser> {
        try {
            const user : IUser = await this.userModel.getByID(id);
            return user;
        } catch (exception) {
            throw new Error(`Failed to find a user with the id: ${id}`);
        }   
    }

    public async subscribe(user : IUser) : Promise<IUser> {
        await this.twitch.subscribe(user.getTwitchUser().userID());
        await this.youtube.subscribeToPushNotifications(user.getYoutubeChannel());
        return user;
	}

    public async unsubscribe(user : IUser): Promise<IUser> {
        await this.twitch.unsubscribe(user.getTwitchUser().userID());
        return user;
    }

    public async deleteUser(id : number) : Promise<IUser> {
        try {
            return await this.userModel.delete(id);
        } catch (error) {
            throw error;
        }
    }

    public async createUser(newUserData : INewUserData) : Promise<IUser> {
        const youtubeChannel : IYoutubeChannel = await this.youtube.getChannel(newUserData.youtubeChannelName);
        try {
            return await this.userModel.create(newUserData.twitchUserID, youtubeChannel);
        } catch (error) {
            throw error;
        }
    }
}