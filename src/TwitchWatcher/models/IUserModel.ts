import TwitchUser from "../schemas/user/TwitchUser";

export default interface IUserModel {
    getByID(id: number) : Promise<TwitchUser>;
}