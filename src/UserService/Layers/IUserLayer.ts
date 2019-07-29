import IUser from "../Models/IUser";
import INewUserData from "./INewUserData";

export default interface IUserLayer {
    getUserInfo(id: string) : Promise<IUser>;
    createUser(userData : INewUserData) : Promise<IUser>;
    subscribe(user : IUser) : Promise<IUser>;
    unsubscribe(user : IUser): Promise<IUser>;
}