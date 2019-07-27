import Express from "express";
import * as BodyParser from "body-parser";
import xmlparser from "express-xml-bodyparser";
import morgan from "morgan";
import IApp from "./IApp";
import ILogger from "../Logging/ILogger";
import IService from "../Service/IService";
import IRouter from "../Router/IRouter";
import PlaygroundRouter from "../YoutubeWatcher/Routes/PlaygroundRouter";

export default abstract class App implements IApp {
    public app: Express.Application;
    protected logger : ILogger;

    constructor(logger : ILogger) {
        this.app = Express();
        this.logger = logger;
        this.app.use(BodyParser.json());
        this.app.use(BodyParser.urlencoded({
            extended: false
        }));
        this.app.use(xmlparser());
        
        const streamOptions : morgan.StreamOptions = {
            write: (message: string): void => {
                // use the 'info' log level so the output will be picked up by both transports (file and console)
                this.logger.info(message);
            },
        };
        this.app.use(morgan('combined', { stream: streamOptions }));
        this.addRouter(new PlaygroundRouter(this.logger));
    }

    public abstract initialize() : void;

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