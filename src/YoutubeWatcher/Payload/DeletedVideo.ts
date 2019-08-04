import { IDeletedVideoPayload } from "./IDeletedVideo";
import { Request } from "express";

export default class DeletedVideoPayload implements IDeletedVideoPayload {
    private _channelID : string;
    private _videoID : string;

    constructor(request : Request) {
        if (!request.body.hasOwnProperty("feed")) {
            throw new Error("Request missing feed");
        }
        if (!request.body.feed.hasOwnProperty("at:deleted-entry")) {
            throw new Error("Request missing deleted-entry");
        }
        if (request.body.feed["at:deleted-entry"].length === 0) {
            throw new Error("Request has no entries");
        }
        if (!request.body.feed["at:deleted-entry"][0].hasOwnProperty("$")) {
            throw new Error("Request missing $");
        }
        if (!request.body.feed["at:deleted-entry"][0].$.hasOwnProperty("ref")) {
            throw new Error("Request missing ref");
        }
        if (!request.body.feed["at:deleted-entry"][0].hasOwnProperty("at:by")) {
            throw new Error("Request missing by");
        }
        if (!request.body.feed["at:deleted-entry"][0]["at:by"][0].hasOwnProperty("uri")) {
            throw new Error("Request missing uri");
        }

        const uriParts : string[] = request.body.feed["at:deleted-entry"][0]["at:by"][0].uri[0].split('/');
        this._channelID = uriParts[uriParts.length - 1];
        this._videoID = request.body.feed["at:deleted-entry"][0].$.ref.replace("yt:video:", "");
    }

    public channelID() : string {
        return this._channelID;
    }

    public videoID() : string {
        return this._videoID;
    }
}