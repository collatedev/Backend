import TwitchUser from "../../src/TwitchWatcherService/schemas/user/TwitchUser";
import IUserModel from "../../src/TwitchWatcherService/models/IUserModel";

export default class MockUserModel implements IUserModel {
    private db : { [key: number]: TwitchUser; };

    constructor() {
        this.db = {};
    }

    public addUser(id: number) : void {
        this.db[id] = new TwitchUser(id);
        this.db[id].followerHook = null;
        this.db[id].streamHook = null;
        this.db[id].userHook = null;
    }

    public async getByID(id: number) : Promise<TwitchUser> {
        if (!this.db.hasOwnProperty(id)) {
            throw new Error(`Failed to get twitch user with id: ${id} from database`);
        } else {
			return this.db[id];
		}
    }
}