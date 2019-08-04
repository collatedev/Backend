import INotification from "../../INotification";

export default interface IStreamStarted extends INotification {
    streamID: number;
	userID: string;
	twitchUserName: string;
	gameID: number;
	communityIDs: number[];
	streamType: string;
	title: string;
	viewerCount: number;
	startedAt: Date;
	language: string;
	thumbnailURL: string;
}