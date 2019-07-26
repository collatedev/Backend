import { Request, Response, NextFunction } from "express";

type IRouteHandlerCallback = (request: Request, response: Response, next? : NextFunction) => void;
type IRouteHandlerPromise = (request: Request, response: Response, next? : NextFunction) => Promise<void>;

type IRouteHandler = IRouteHandlerCallback | IRouteHandlerPromise;

export default IRouteHandler;