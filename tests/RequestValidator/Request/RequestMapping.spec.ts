import IRequestMapping from "../../../src/RequestValidator/Request/IRequestMapping";
import RequestMapping from "../../../src/RequestValidator/Request/RequestMapping";

test('should fail to create request mapping due to null mapping', () => {
    expect(createMapping(null)).toThrow(TypeError);
});

test('should fail to create request mapping due to illegal type mapping', () => {
    expect(createMapping(1)).toThrow(TypeError);
});

test('should create an empty mapping', () => {
    const mapping : IRequestMapping = new RequestMapping({});

    expect(mapping.keys()).toHaveLength(0);
});

test('should throw due to using a key not stored in the mapping', () => {
    const mapping : IRequestMapping = new RequestMapping({});

    expect(() : any => {
        return mapping.value("foo");
    }).toThrow(Error);
});

test('should create a mapping', () => {
    const mapping : IRequestMapping = new RequestMapping({
        foo: "bar"
    });

    expect(mapping.keys()).toHaveLength(1);
    expect(mapping.has("foo")).toBeTruthy();
    expect(mapping.value("foo")).toEqual("bar");
});

function createMapping(mapping : any) : () => IRequestMapping {
    return () : IRequestMapping => {
        return new RequestMapping(mapping);
    };
}