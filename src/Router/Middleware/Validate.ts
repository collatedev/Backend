import IValidationSchema from "../../RequestValidator/ValidationSchema/IValidationSchema";
import IRouteHandler from "../IRouteHandler";
import { Request, Response, NextFunction } from "express";
import StatusCodes from "../StatusCodes";
import ErrorMessage from "../Messages/ErrorMessage";
import IRequestBuilder from "../../RequestValidator/Request/IRequestBuilder";
import RequestBuilder from "../../RequestValidator/Request/RequestBuilder";
import IValidationResult from "../../RequestValidator/ValidationResult/IValidationResult";
import IValidator from "../../RequestValidator/IValidator";
import Validator from "../../RequestValidator/Validator";
import IRequest from "../../RequestValidator/Request/IRequest";

const RouteValidator : IValidator = new Validator();

export default function validate(schema : IValidationSchema) : IRouteHandler {
    return (
        request : Request, 
        response : Response, 
        next? : NextFunction
    ) : void => {
        const requestBuilder : IRequestBuilder = new RequestBuilder();
        const requestSchema : IValidationSchema =   schema;

        if (!isEmpty(request.body)) {
            requestBuilder.setBody(request.body);
        } 
        if (!isEmpty(request.cookies)) {
            requestBuilder.setCookies(request.cookies);
        }
        if (!isEmpty(request.headers)) {
            requestBuilder.setHeaders(request.headers);
        } 
        if (!isEmpty(request.params)) {
            requestBuilder.setParams(request.params);
        }
        if (!isEmpty(request.query)) {
            requestBuilder.setQuery(request.query);
        } 

        const validationRequest : IRequest = requestBuilder.build();

        try {
            const result : IValidationResult = RouteValidator.validate(validationRequest, requestSchema);
            if (!result.isValid()) {
                requestBuilder.reset();
                return sendError(response, result.errors(), StatusCodes.BadRequest);
            }
        } catch (error) {
            return sendError(response, error, StatusCodes.BadRequest);
        }
        if (next) {
            return next();
        }
        throw new Error('Missing route handler');
    };
}

function isEmpty(obj : any) : boolean {
    for(const key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

function sendError(response: Response, error: any, status: number) : void {
    response
        .status(status)
        .json(new ErrorMessage(error));
}