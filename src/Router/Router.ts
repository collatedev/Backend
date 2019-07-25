import * as Express from "express";
import IRouter from "./IRouter";
import * as Path from "path";
import IRouteHandler from "./IRouteHandler";
import StatusCodes from "./StatusCodes";
import ErrorMessage from "./Messages/ErrorMessage";
import DataMessage from "./Messages/DataMessage";
import IValidationSchema from "../RequestValidator/ValidationSchema/IValidationSchema";
import IRequestBuilder from "../RequestValidator/Request/IRequestBuilder";
import ILogger from "../Logging/ILogger";
import IValidationResult from "../RequestValidator/ValidationResult/IValidationResult";
import RequestBuilder from "../RequestValidator/Request/RequestBuilder";
import IValidator from "../RequestValidator/IValidator";
import Validator from "../RequestValidator/Validator";

const RouteValidator : IValidator = new Validator();

export default abstract class Router implements IRouter {
	private readonly RootPath: string = '/api/v1';

    private router : Express.Router;
    private basePath : string;
    private requestBuilder : IRequestBuilder;
    protected logger : ILogger;

    constructor(path: string, logger : ILogger) {
        this.basePath = path;
        this.router = Express.Router();
        this.requestBuilder = new RequestBuilder();
        this.logger = logger;
    }

    public getPath() : string {
        return Path.join(this.RootPath, this.basePath);
    }

    public getRouter() : Express.Router {
        return this.router;
    }

    public delete(path : string, handler : IRouteHandler, schema : IValidationSchema) : void {
        this.router.delete(path, this.validate(schema), handler);
    }

    public get(path : string, handler : IRouteHandler, schema : IValidationSchema) : void {
        this.router.get(path, this.validate(schema), handler);
    }

    public patch(path : string, handler : IRouteHandler, schema : IValidationSchema) : void {
        this.router.patch(path, this.validate(schema), handler);
    }

    public post(path : string, handler : IRouteHandler, schema : IValidationSchema) : void {
        this.router.post(path, this.validate(schema), handler);
    }

    public put(path : string, handler : IRouteHandler, schema : IValidationSchema) : void {
        this.router.put(path, this.validate(schema), handler);
    }

    public validate(schema : IValidationSchema) : IRouteHandler {
        return (
            request : Express.Request, 
            response : Express.Response, 
            next? : Express.NextFunction
        ) : void => {
            const requestSchema : IValidationSchema = schema;

            if (!this.isEmpty(request.body)) {
                this.requestBuilder.setBody(request.body);
            } 
            if (!this.isEmpty(request.cookies)) {
                this.requestBuilder.setCookies(request.cookies);
            }
            if (!this.isEmpty(request.headers)) {
                this.requestBuilder.setHeaders(request.headers);
            } 
            if (!this.isEmpty(request.params)) {
                this.requestBuilder.setParams(request.params);
            }
            if (!this.isEmpty(request.query)) {
                this.requestBuilder.setQuery(request.query);
            } 

            const result : IValidationResult = RouteValidator.validate(this.requestBuilder.build(), requestSchema);
            if (!result.isValid()) {
                this.sendError(response, result.errors(), StatusCodes.BadRequest);
            }
            if (next) {
                return next();
            }
            throw new Error('Missing route handler');
        };
    }

    private isEmpty(obj : any) : boolean {
        for(const key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }

    protected sendError(response: Express.Response, error: any, status: number) : void {
        response
            .json(new ErrorMessage(error))
            .status(status);
    }

    protected sendData(response: Express.Response, data: any, status: number) : void {
        response
            .json(new DataMessage(data))
            .status(status);
    }
    
    public abstract setup() : void;
}