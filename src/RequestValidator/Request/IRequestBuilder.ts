import IRequest from "./IRequest";

export default interface IRequestBuilder {
    setBody(body : any) : IRequestBuilder;
    setCookies(cookies : any) : IRequestBuilder;
    setHeaders(headers : any) : IRequestBuilder;
    setParams(params : any) : IRequestBuilder;
    setQuery(query : any) : IRequestBuilder;
    build() : IRequest;
}