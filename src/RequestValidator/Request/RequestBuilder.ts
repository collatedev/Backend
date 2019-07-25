import IRequestBuilder from "./IRequestBuilder";
import IRequest from "./IRequest";
import Request from "./Request";

export default class RequestBuilder implements IRequestBuilder {
    private body : any;
    private cookies : any;
    private headers : any;
    private params : any;
    private query : any;

    constructor() {
        this.body = null;
        this.cookies = null;
        this.headers = null;
        this.params = null;
        this.query = null;
    }

    public setBody(body: any): IRequestBuilder {
        this.body = body;
        return this;
    }    
    
    public setCookies(cookies: any): IRequestBuilder {
        this.cookies = cookies;
        return this;
    }

    public setHeaders(headers: any): IRequestBuilder {
        this.headers = headers;
        return this;
    }

    public setParams(params: any): IRequestBuilder {
        this.params = params;
        return this;
    }

    public setQuery(query: any): IRequestBuilder {
        this.query = query;
        return this;
    }

    public build(): IRequest {
        return new Request(this.body, this.cookies, this.headers, this.params, this.query);
    }
}