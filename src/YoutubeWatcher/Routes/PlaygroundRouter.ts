import Router from "../../Router/Router";
import ILogger from "../../Logging/ILogger";
import { Request, Response } from "express";
import ValidationSchema from "../../RequestValidator/ValidationSchema/ValidationSchema";
import IValidationSchema from "../../RequestValidator/ValidationSchema/IValidationSchema";
import StatusCodes from "../../Router/StatusCodes";

const InsecureSchema : IValidationSchema = new ValidationSchema({
    "types": {
        "request": {
            "body": {
                "required": false,
                "type": "any"
            },
            "query": {
                "required": false,
                "type": "any"
            },
            "headers": {
                "required": false,
                "type": "any"
            },
            "cookies": {
                "required": false,
                "type": "any"
            },
            "params": {
                "required": false,
                "type": "any"
            }
        }
    }
});

export default class PlaygroundRouter extends Router {
    constructor(logger : ILogger) {
        super('/test', logger);
        this.handleWebhook = this.handleWebhook.bind(this);
        this.handleData = this.handleData.bind(this);
    }

    public setup() : void {
        this.get('/', this.handleWebhook, InsecureSchema);
        this.post('/', this.handleData, InsecureSchema);
    }

    public handleWebhook(request : Request, response : Response) : void {
        this.logger.info(JSON.stringify(request.body, null, 1));
        this.logger.info(JSON.stringify(request.query, null, 1));
        response.send(request.query["hub.challenge"]).status(StatusCodes.OK);
    }

    public handleData(request : Request, response : Response) : void {
        this.logger.info(JSON.stringify(request.body, null, 1));
        this.logger.info(JSON.stringify(request.query, null, 1));
        response.send("hello").status(StatusCodes.OK);
    }
}