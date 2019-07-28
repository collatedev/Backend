import IUserModel from "../../src/UserService/models/IUserModel";
import IUser from "../../src/UserService/models/IUser";
import User from "../../src/UserService/Models/User";
import IYoutubeChannel from "../../src/UserService/models/IYoutubeChannel";

export default class MockUserModel implements IUserModel {
    private db : { [key: number]: IUser; };
    private id : number;

    constructor() {
        this.db = {};
        this.id = 0;
    }

    public async getByID(id: number) : Promise<IUser> {
        if (!this.db.hasOwnProperty(id)) {
            throw new Error(`Failed to get twitch user with id: ${id} from database`);
        } else {
			return this.db[id];
		}
    }

    public async create(twitchID : number, channel : IYoutubeChannel) : Promise<IUser> {
        this.db[this.id] = new User(this.id, twitchID, channel);
        const user : IUser = this.db[this.id];
        this.id++;
        return user;
    }

    public async delete(id : number) : Promise<IUser> {
        const user : IUser = this.db[id];
        delete this.db[id];
        return user;
    }
}