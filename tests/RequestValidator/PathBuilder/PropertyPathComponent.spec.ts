import PropertyPathComponent from "../../../src/RequestValidator/PathBuilder/PropertyPathComponent";
import IPathComponent from "../../../src/RequestValidator/PathBuilder/IPathComponent";

test("Should create a path component with out double quotes", () => {
    const component : IPathComponent = new PropertyPathComponent("mode");

    expect(component.toString()).toEqual(".mode");
});

test("Should create a path component with double quotes", () => {
    const component : IPathComponent = new PropertyPathComponent("hub.mode");

    expect(component.toString()).toEqual(".\"hub.mode\"");
});