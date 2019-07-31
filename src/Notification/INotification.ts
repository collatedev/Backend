import { Document } from "mongoose";

export default interface INotification extends Document {
    type : string;
    fromUserID : string;
    createdAt : Date;
    isDuplicate() : Promise<boolean>;
}