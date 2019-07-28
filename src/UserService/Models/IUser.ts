import ITwitchUser from './ITwitchUser';
import IYoutubeChannel from './IYoutubeChannel';

export default interface IUser {
    getID() : number;
    getTwitchUser() : ITwitchUser;
    getYoutubeChannel() : IYoutubeChannel;
}