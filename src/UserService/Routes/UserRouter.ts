import { Response, Request } from "express";
import GetUserRequestSchema from "../RequestSchemas/GetUserRequest.json";
import IUserLayer from "../layers/IUserLayer";
import Router from "../../Router/Router";
import ILogger from "../../Logging/ILogger";
import ValidationSchema from "../../RequestValidator/ValidationSchema/ValidationSchema";
import StatusCodes from "../../Router/StatusCodes";
import IUser from "../Models/IUser";
import CreateUserSchema from "../Validation/CreateUserSchema.json";

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
		this.post('/', this.createUser, new ValidationSchema(CreateUserSchema));
	}

	public async handleGetUserByID(request: Request, response: Response) : Promise<void> {
		await this.getUserByID(response, request.params.userID);
	}

	private async getUserByID(response: Response, userID: string) : Promise<void> {
		try {
			const user : IUser = await this.userLayer.getUserInfo(userID);
			this.logger.info(`Successfully got user: ${JSON.stringify(user.toJSON())}`);
			this.sendData(response, user.toJSON(), StatusCodes.OK);
		} catch (error) {
			this.logger.error(error);
			this.sendError(response, `Failed to get user with id: ${userID}`, StatusCodes.NotFound);
		}
	}

	private async createUser(request : Request, response : Response) : Promise<void> {
		try {
			const user : IUser = await this.userLayer.createUser(request.body);
			this.sendData(response, user.toJSON(), StatusCodes.OK);
		} catch (error) {
			this.sendError(response, "Failed to create user", StatusCodes.BadRequest);
		}
	}
}