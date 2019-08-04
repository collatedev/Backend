import { Document } from "mongoose";

export default interface IStreamStarted extends Document {
    streamID: number;
	userID: string;
	twitchUserName: string;
	gameID: number;
	communityIDs: number[];
	type: string;
	title: string;
	viewerCount: number;
	startedAt: Date;
	language: string;
	thumbnailURL: string;
}