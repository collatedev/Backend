import IUser from './IUser';
import IYoutubeChannel from './IYoutubeChannel';

export default interface IUserModel {
    getByID(id: number) : Promise<IUser>;
    delete(id : number) : Promise<IUser>;
    create(twitchID : number, channel : IYoutubeChannel) : Promise<IUser>;
}