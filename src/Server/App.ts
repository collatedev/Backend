import * as Express from "express";
import * as BodyParser from "body-parser";
import * as morgan from "morgan";
import { ILogger } from "@collate/logging";
import IApp from "./IApp";
import { IRouter } from "@collate/router";
import IService from "../../Service/src/Service/IService";

export default class App implements IApp {
    public app: Express.Application;
    private logger : ILogger;

    constructor(logger : ILogger) {
        this.app = Express();
        this.logger = logger;
    }

    public initialize() : void {
        this.app.use(BodyParser.json());
        this.app.use(BodyParser.urlencoded({
            extended: false
        }));
        
        const streamOptions : morgan.StreamOptions = {
            write: (message: string): void => {
                // use the 'info' log level so the output will be picked up by both transports (file and console)
                this.logger.info(message);
            },
        };

        this.app.use(morgan('combined', { stream: streamOptions }));
    }

    public start(port: number) : void {
        this.app.listen(port, () : void => {
            this.logger.info(`Server is listening on port ${port}`);
        });
    }

    public registerService(service : IService) : void {
        for (const api of service.getAPIs()) {
            for (const router of api.getRoutes()) {
                this.addRouter(router);
            }
        }
    }

    private addRouter(router: IRouter) : void {
        router.setup();
        this.app.use(router.getPath(), router.getRouter());
    }
}