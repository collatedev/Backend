import ICallbackRouter from './ICallbackRouter';
import ILogger from '../../Logging/ILogger';
import Router from '../../Router/Router';
import { Request, Response } from 'express';
import ValidationSchema from '../../RequestValidator/ValidationSchema/ValidationSchema';
import WebhookRequestSchema from '../../RequestSchemas/WebhookChallengeRequest.json';
import IValidationSchema from '../../RequestValidator/ValidationSchema/IValidationSchema';
import StatusCodes from '../../Router/StatusCodes';

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

export default class CallbackRouter extends Router implements ICallbackRouter {
    constructor(logger : ILogger) {
        super('/youtube', logger);
        this.handleCallback = this.handleCallback.bind(this);
        this.handleChallenge = this.handleChallenge.bind(this);
    }

    public setup() : void {
        this.get('/', this.handleChallenge, new ValidationSchema(WebhookRequestSchema));
        this.post('/', this.handleCallback, InsecureSchema);
    }

    public async handleChallenge(request : Request, response : Response) : Promise<void> {
        response.send(request.query["hub.challenge"]).status(StatusCodes.OK);
    }

    public async handleCallback(request : Request, response : Response) : Promise<void> {
        const spacing : number = 4;
        this.logger.info(JSON.stringify(request.body, null, spacing));
        return;
    }
}