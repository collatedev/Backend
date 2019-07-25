import IService from "../../src/Service/IService";
import MockService from "../mocks/MockService";
import MockAPI from "../mocks/MockAPI";

test("Creates a service", () => {
    const service : IService = new MockService();

    expect(service.getAPIs()).toHaveLength(0);
});

test("Creates a service with an API", () => {
    const service : IService = new MockService();

    service.registerAPI(new MockAPI());

    expect(service.getAPIs()).toHaveLength(1);
    expect(service.getAPIs()[0]).toEqual(new MockAPI());
});