import * as Express from "express";
import IRouter from "./IRouter";
import * as Path from "path";
import IRouteHandler from "./IRouteHandler";
import ErrorMessage from "./Messages/ErrorMessage";
import DataMessage from "./Messages/DataMessage";
import IValidationSchema from "../RequestValidator/ValidationSchema/IValidationSchema";
import ILogger from "../Logging/ILogger";
import validate from "./Middleware/Validate";

export default abstract class Router implements IRouter {
	private readonly RootPath: string = '/api/v1';

    private router : Express.Router;
    private basePath : string;
    protected logger : ILogger;

    constructor(path: string, logger : ILogger) {
        this.basePath = path;
        this.router = Express.Router();
        this.logger = logger;
    }

    public getPath() : string {
        return Path.join(this.RootPath, this.basePath);
    }

    public getRouter() : Express.Router {
        return this.router;
    }

    public delete(path : string, handler : IRouteHandler, schema : IValidationSchema) : void {
        this.router.delete(path, validate(schema), handler);
    }

    public get(path : string, handler : IRouteHandler, schema : IValidationSchema) : void {
        this.router.get(path, validate(schema), handler);
    }

    public patch(path : string, handler : IRouteHandler, schema : IValidationSchema) : void {
        this.router.patch(path, validate(schema), handler);
    }

    public post(path : string, handler : IRouteHandler, schema : IValidationSchema) : void {
        this.router.post(path, validate(schema), handler);
    }

    public put(path : string, handler : IRouteHandler, schema : IValidationSchema) : void {
        this.router.put(path, validate(schema), handler);
    }

    protected sendError(response: Express.Response, error: any, status: number) : void {
        response
            .status(status)
            .json(new ErrorMessage(error));
    }

    protected sendData(response: Express.Response, data: any, status: number) : void {
        response
            .status(status)
            .json(new DataMessage(data));
    }
    
    public abstract setup() : void;
}