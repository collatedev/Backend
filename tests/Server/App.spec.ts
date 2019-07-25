import App from "../../src/Server/App";
import MockLogger from "../mocks/MockLogger";
import IApp from "../../src/Server/IApp";

test("Creates an app", () => {
    const app : IApp = new App(new MockLogger());

    expect(app).not.toBeNull();
});