import Router from "../../src/Router/Router";
import MockRouter from "../mocks/MockRouter";

describe('getPath', () => {
	test('Should get path of the router', () => {
		const router : Router = new MockRouter();

		expect(router.getPath()).toEqual("/api/v1/test");
	});
});

describe('getRouter', () => {
	test('Should get router object', () => {
		const router : Router = new MockRouter();
		
		expect(router.getRouter()).not.toBeNull();
	});
});