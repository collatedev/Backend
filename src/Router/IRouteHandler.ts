import { Request, Response } from "express";
import { NextFunction } from "connect";

type IRouteHandlerCallback = (request: Request, response: Response, next? : NextFunction) => void;
type IRouteHandlerPromise = (request: Request, response: Response, next? : NextFunction) => Promise<void>;

type IRouteHandler = IRouteHandlerCallback | IRouteHandlerPromise;

export default IRouteHandler;