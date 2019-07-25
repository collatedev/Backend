import IPathBuilder from "../../../src/RequestValidator/PathBuilder/IPathBuilder";
import PathBuilder from "../../../src/RequestValidator/PathBuilder/PathBuilder";
import PropertyPathComponent from "../../../src/RequestValidator/PathBuilder/PropertyPathComponent";
import IndexPathComponent from "../../../src/RequestValidator/PathBuilder/IndexPathComponent";
import IPathComponent from "../../../src/RequestValidator/PathBuilder/IPathComponent";

test("Gets an empty path", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();

    expect(pathBuilder.getPath()).toEqual("");
    expect(pathBuilder.getCurrentIndex()).toEqual("");
});

test("Gets a component path", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();

    pathBuilder.addPathComponent(new PropertyPathComponent("foo"));

    expect(pathBuilder.getPath()).toEqual("foo");
    expect(pathBuilder.getCurrentIndex()).toEqual("");
});

test("Gets path components of the current index", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();

    pathBuilder.addPathComponent(new IndexPathComponent(0));

    expect(pathBuilder.getCurrentIndex()).toEqual("[0]");
    expect(pathBuilder.getCurrentIndexComponents()).toEqual([new IndexPathComponent(0)]);
});

test("Gets an index path", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();

    pathBuilder.addPathComponent(new IndexPathComponent(0));

    expect(pathBuilder.getPath()).toEqual("[0]");
    expect(pathBuilder.getCurrentIndex()).toEqual("[0]");
});

test("Gets an indexed path", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();

    pathBuilder.addPathComponent(new PropertyPathComponent("foo"));
    pathBuilder.addPathComponent(new IndexPathComponent(1));

    expect(pathBuilder.getPath()).toEqual("foo[1]");
    expect(pathBuilder.getCurrentIndex()).toEqual("[1]");
});

test("Gets a path where the property is on an index", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();

    pathBuilder.addPathComponent(new PropertyPathComponent("foo"));
    pathBuilder.addPathComponent(new IndexPathComponent(1));
    pathBuilder.addPathComponent(new PropertyPathComponent("bar"));

    expect(pathBuilder.getPath()).toEqual("foo[1].bar");
    expect(pathBuilder.getCurrentIndex()).toEqual("");
});

test("Gets a path where root is an index and it has a property", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();

    pathBuilder.addPathComponent(new IndexPathComponent(1));
    pathBuilder.addPathComponent(new PropertyPathComponent("foo"));

    expect(pathBuilder.getPath()).toEqual("[1].foo");
    expect(pathBuilder.getCurrentIndex()).toEqual("");
});

test("Gets a path where a component has been removed", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();

    pathBuilder.addPathComponent(new PropertyPathComponent("foo"));
    pathBuilder.addPathComponent(new IndexPathComponent(1));
    pathBuilder.addPathComponent(new PropertyPathComponent("bar"));

    const poppedComponent : IPathComponent = pathBuilder.popComponent();

    expect(pathBuilder.getPath()).toEqual("foo[1]");
    expect(pathBuilder.getCurrentIndex()).toEqual("[1]");
    expect(poppedComponent.toString()).toEqual(".bar");
});

test("Copies a path builder", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();

    pathBuilder.addPathComponent(new PropertyPathComponent("foo"));

    const copiedPathBuilder : IPathBuilder = new PathBuilder(pathBuilder);

    copiedPathBuilder.addPathComponent(new IndexPathComponent(1));

    expect(copiedPathBuilder.getPath()).toEqual("foo[1]");
    expect(copiedPathBuilder.getCurrentIndex()).toEqual("[1]");
});

test("Gets components of a path builder", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();

    pathBuilder.addPathComponent(new PropertyPathComponent("foo"));

    expect(pathBuilder.getComponents()).toEqual([new PropertyPathComponent("foo")]);
});

test("Adds components to a path builder", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();

    pathBuilder.addPathComponents([
        new PropertyPathComponent("foo"),
        new PropertyPathComponent("bar")
    ]);

    expect(pathBuilder.getPath()).toEqual("foo.bar");
});

test("Pops components from a path builder", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();
    const components : IPathComponent[] = [
        new PropertyPathComponent("foo"),
        new PropertyPathComponent("bar")
    ];

    pathBuilder.addPathComponents(components);

    const poppedComponents : IPathComponent[] = pathBuilder.popComponents(components.length);

    expect(pathBuilder.getPath()).toEqual("");
    expect(poppedComponents.length).toEqual(components.length);
    expect(poppedComponents).toEqual([
        components[1],
        components[0]
    ]);
});

test("Pops illegal amount of components from a path builder", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();
    const components : IPathComponent[] = [
        new PropertyPathComponent("foo"),
        new PropertyPathComponent("bar")
    ];

    pathBuilder.addPathComponents(components);

    expect(() => {
        pathBuilder.popComponents(components.length + 1);
    }).toThrow(new Error("Can not pop a component from an empty stack"));
});

test("Throws an error when a component is popped from an empty component", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();

    expect(() => {
        pathBuilder.popComponent();
    }).toThrow(RangeError);
});