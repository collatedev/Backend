import App from "./App";
import * as Dotenv from "dotenv";
import { ILogger, Logger } from "@collate/logging";

const PortIndex : number = 2;

function main() : void {
	Dotenv.config();
	const logger : ILogger = getLogger();
	const app : App = new App(logger);
	app.initialize();

	const port : number = parseInt(process.argv[PortIndex], 10);
	app.start(port);
}

function getLogger() : ILogger {
	if (process.env.LOG_LEVEL) {
		return new Logger(process.env.LOG_LEVEL, "app.log");
	} else {
		return new Logger("info", "app.log");
	}
}

try {
	main();
} catch(error) {
	throw error;
}