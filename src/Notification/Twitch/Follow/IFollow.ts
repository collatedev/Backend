import INotification from "../../INotification";

export default interface IFollow extends INotification {
    fromID: string | null;
    fromTwitchID: number;
    fromName: string;
    toID: string | null;
    toTwitchID: number;
    toName: string;
    followedAt: Date;
}