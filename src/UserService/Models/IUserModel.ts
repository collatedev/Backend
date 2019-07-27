import IUser from './IUser';
import INewUserData from '../Layers/INewUserData';

export default interface IUserModel {
    getByID(id: number) : Promise<IUser>;
    delete(id : number) : Promise<IUser>;
    create(newUserData : INewUserData) : Promise<IUser>;
}