import { Router } from "express";
import IRouteHandler from "./IRouteHandler";
import IValidationSchema from "../RequestValidator/ValidationSchema/IValidationSchema";

export default interface IRouter {
    setup(): void;
    getPath(): string;
    getRouter(): Router;
    delete(path : string, handler : IRouteHandler, schema : IValidationSchema) : void;
    get(path : string, handler : IRouteHandler, schema : IValidationSchema) : void;
    post(path : string, handler : IRouteHandler, schema : IValidationSchema) : void;
    patch(path : string, handler : IRouteHandler, schema : IValidationSchema) : void;
    put(path : string, handler : IRouteHandler, schema : IValidationSchema) : void;
}