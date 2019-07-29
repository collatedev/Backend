import IUserLayer from "./IUserLayer";
import UserModel from "../Models/UserModel";
import ITwitchService from "../../TwitchWatcher/Twitch/ITwitchService";
import IUser from "../Models/IUser";
import INewUserData from "./INewUserData";
import IYoutube from "../../YoutubeWatcher/Youtube/IYoutube";
import IYoutubeChannel from "../Models/IYoutubeChannel";

export default class UserLayer implements IUserLayer {
    private twitch : ITwitchService;
    private youtube : IYoutube;

    constructor(twitch : ITwitchService, youtube : IYoutube) {
        this.twitch = twitch;
        this.youtube = youtube;
    }

    public async getUserInfo(id: string) : Promise<IUser> {
        const user : IUser | null = await UserModel.findById(id).exec();
        if (user === null) {
            throw new Error(`User with id = "${id}" not found`);
        }
        return user;  
    }

    public async subscribe(user : IUser) : Promise<IUser> {
        await this.twitch.subscribe(user.getTwitchUser().userID());
        await this.youtube.subscribeToPushNotifications(user.youtubeChannel);
        return user;
	}

    public async unsubscribe(user : IUser): Promise<IUser> {
        await this.twitch.unsubscribe(user.getTwitchUser().userID());
        return user;
    }

    public async createUser(newUserData : INewUserData) : Promise<IUser> {
        const user : IUser = await this.saveUser(newUserData);
        try {
            await this.subscribe(user);
            return user;
        } catch (error) {
            await user.remove();
            throw error;
        }
    }

    private async saveUser(newUserData : INewUserData) : Promise<IUser> {
        const youtubeChannel : IYoutubeChannel = await this.youtube.getChannel(newUserData.youtubeChannelName);
        return new UserModel({
            twitchID: newUserData.twitchUserID, 
            youtubeChannel
        }).save();
    }
}