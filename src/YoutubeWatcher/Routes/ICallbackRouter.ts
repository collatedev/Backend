import { Request, Response } from "express";

export default interface ICallbackRouter {
    handleChallenge(request : Request, response : Response) : Promise<void>;
    handleCallback(request : Request, response : Response) : Promise<void>;
}