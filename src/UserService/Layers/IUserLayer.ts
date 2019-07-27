import IUser from "../models/IUser";
import INewUserData from "./INewUserData";

export default interface IUserLayer {
    getUserInfo(id: number) : Promise<IUser>;
    createUser(userData : INewUserData) : Promise<IUser>;
    deleteUser(id : number) : Promise<IUser>;
    subscribe(user : IUser) : Promise<IUser>;
    unsubscribe(user : IUser): Promise<IUser>;
}