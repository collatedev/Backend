import { Document } from "mongoose";

export default interface INotification extends Document {
    type : string;
    fromUserID : String;
    createdAt : Date;
}