import IRequest from "../../../src/RequestValidator/Request/IRequest";
import Validatable from "../../../src/RequestValidator/Request/Validatable";
import RequestMapping from "../../../src/RequestValidator/Request/RequestMapping";

test("Should create a validatable object", () => {
    const validatable : IRequest = new Validatable({
        foo: "bar"
    }); 

    expect(validatable.getRequest()).toEqual(new RequestMapping({
        foo: "bar"
    }));
    
    expect(validatable.toJson()).toEqual({
        foo: "bar"
    });
});