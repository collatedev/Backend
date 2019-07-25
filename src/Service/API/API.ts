import IAPI from './IAPI';
import IRouter from '../../Router/IRouter';

export default abstract class API implements IAPI {
    private routes : IRouter[];

    constructor() {
        this.routes = [];
    }

    public getRoutes() : IRouter[] {
        return this.routes;
    }

    public registerRoute(router : IRouter) : void {
        this.routes.push(router);
    }
}