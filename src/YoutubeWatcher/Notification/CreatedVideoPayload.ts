import ICreatedVideoPayload from "./ICreatedVideoPayload";
import { Request } from "express";

export default class CreatedVideoPayload implements ICreatedVideoPayload {
    private body : any;

    constructor(request : Request) {
        if (!request.body.hasOwnProperty("feed")) {
            throw new Error("Request is missing feed");
        }
        if (!request.body.feed.hasOwnProperty("entry")) {
            throw new Error("Request is missing entry");
        }
        if (request.body.feed.entry.length === 0) {
            throw new Error("Request is has no entries");
        }
        if (!request.body.feed.entry[0].hasOwnProperty("yt:channelid")) {
            throw new Error("Request is missing channelID");
        }
        if (!request.body.feed.entry[0].hasOwnProperty("published")) {
            throw new Error("Request is missing datePublished");
        }
        if (!request.body.feed.entry[0].hasOwnProperty("link")) {
            throw new Error("Request is missing link");
        }
        if (!request.body.feed.entry[0].hasOwnProperty("title")) {
            throw new Error("Request is missing title");
        }
        if (!request.body.feed.entry[0].hasOwnProperty("yt:videoid")) {
            throw new Error("Request is missing videoID");
        }
        this.body = request.body;
    }

    public channelID() : string {
        return this.body.feed.entry[0]["yt:channelid"][0];
    }

    public datePublished() : Date {
        return new Date(this.body.feed.entry[0].published[0]);
    }

    public link() : string {
        return this.body.feed.entry[0].link[0].$.href;
    }
    
    public title() : string {
        return this.body.feed.entry[0].title[0];
    }

    public videoID() : string {
        return this.body.feed.entry[0]["yt:videoid"][0];
    }
}