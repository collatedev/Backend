import MockLogger from "../mocks/MockLogger";
import IApp from "../../src/Server/IApp";
import MockApp from "../mocks/MockApp";
import mongoose from "mongoose";

jest.mock('mongoose');

test("Creates an app", () => {
    mongoose.connect = jest.fn().mockReturnValueOnce(Promise.resolve());

    const app : IApp = new MockApp(new MockLogger());

    expect(app).not.toBeNull();
});