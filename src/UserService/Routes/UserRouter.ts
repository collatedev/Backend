import { Response, Request } from "express";
import GetUserRequestSchema from "../RequestSchemas/GetUserRequest.json";
import IUserLayer from "../layers/IUserLayer";
import Router from "../../Router/Router";
import ILogger from "../../Logging/ILogger";
import IValidationSchema from "../../RequestValidator/ValidationSchema/IValidationSchema";
import ValidationSchema from "../../RequestValidator/ValidationSchema/ValidationSchema";
import StatusCodes from "../../Router/StatusCodes";
import IUser from "../models/IUser";

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

export default class UserRouter extends Router {
	private userLayer : IUserLayer;
	
	constructor(userLayer: IUserLayer, logger : ILogger) {
		super('/user', logger);
		this.userLayer = userLayer; 
		this.handleGetUserByID = this.handleGetUserByID.bind(this);
		this.createUser = this.createUser.bind(this);
	}

	public setup() : void {
		this.get('/:userID', this.handleGetUserByID, new ValidationSchema(GetUserRequestSchema));
		this.post('/', this.createUser, InsecureSchema);
	}

	public async handleGetUserByID(request: Request, response: Response) : Promise<void> {
		await this.getUserByID(response, parseInt(request.params.userID, 10));
	}

	private async getUserByID(response: Response, userID: number) : Promise<void> {
		try {
			const user : IUser = await this.userLayer.getUserInfo(userID);
			this.logger.info(`Successfully got user: ${JSON.stringify(user)}`);
			this.sendData(response, user, StatusCodes.OK);
		} catch (error) {
			this.logger.error(error);
			this.sendError(response, `Failed to get user with id: ${userID}`, StatusCodes.NotFound);
		}
	}

	private async createUser(request : Request, response : Response) : Promise<void> {
		const user : IUser = await this.userLayer.createUser(request.body);
		try {
			await this.userLayer.subscribe(user);
		} catch (error) {
			await this.userLayer.deleteUser(user.getID());
			this.sendError(response, "Failed to subscribe user to webhooks", StatusCodes.BadRequest);
		}
		return this.sendData(response, user, StatusCodes.OK);
	}
}