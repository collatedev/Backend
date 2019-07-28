import MockLogger from "../mocks/MockLogger";
import IApp from "../../src/Server/IApp";
import MockApp from "../mocks/MockApp";

test("Creates an app", () => {
    const app : IApp = new MockApp(new MockLogger());

    expect(app).not.toBeNull();
});