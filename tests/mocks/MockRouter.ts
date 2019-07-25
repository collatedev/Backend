import Router from "../../src/Router/Router";
import { Request, Response } from "express";
import StatusCodes from "../../src/Router/StatusCodes";
import ILogger from "../../src/Logging/ILogger";
import MockLogger from "../mocks/MockLogger";
import ValidationSchema from "../../src/RequestValidator/ValidationSchema/ValidationSchema";

const logger : ILogger = new MockLogger();

export default class MockRouter extends Router {
	constructor(path? : string) {
		if (path) {
			super(path, logger);
		} else {
			super("/test", logger);
		}
	}

	public setup(): void {
		this.get('/a', (request: Request, response: Response): void => {
			response.send("test").status(StatusCodes.OK);
		}, new ValidationSchema({
			types: {
				request: {
					body: {
						type: "string",
						required: true
					}
				}
			}
		}));
	}
}