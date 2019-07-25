import IRequest from "./IRequest";
import IRequestMapping from "./IRequestMapping";
import RequestMapping from "./RequestMapping";

export default class Request implements IRequest {
    private readonly body : any;
    private readonly cookies : any;
    private readonly headers : any;
    private readonly params : any;
    private readonly query : any;

    constructor(
        body : any, 
        cookies : any, 
        headers : any, 
        params : any, 
        query : any
    ) {
        this.body = body;
        this.cookies = cookies;
        this.headers = headers;
        this.params = params;
        this.query = query;
    }

	public getRequest() : IRequestMapping {
		return new RequestMapping(this.toJson());
	}

	public toJson() : any {
		const json : any = {};
		if (this.body) {
			json.body = this.body;
		}
		if (this.cookies) {
			json.cookies = this.cookies;
		}
		if (this.headers) {
			json.headers = this.headers;
		}
		if (this.params) {
			json.params = this.params;
		}
		if (this.query) {
			json.query = this.query;
		}
		return json;
	}
}