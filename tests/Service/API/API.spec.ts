import IAPI from "../../../src/Service/API/IAPI";
import MockAPI from "../../mocks/MockAPI";
import MockRouter from "../../mocks/MockRouter";
import IRouter from "../../../src/Router/IRouter";

test("Gets routes from an empty API", () => {
    const api : IAPI = new MockAPI();

    expect(api.getRoutes()).toHaveLength(0);
});

test("Gets routes from an API with a route", () => {
    const api : IAPI = new MockAPI();

    api.registerRoute(new MockRouter("/foo"));

    const routes : IRouter[] = api.getRoutes();

    expect(routes).toHaveLength(1);
    expect(routes[0].getPath()).toEqual("/api/v1/foo");
});
