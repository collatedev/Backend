import IPathBuilder from "../PathBuilder/IPathBuilder";

export default interface INestedArray {
    depth() : number;
    value() : any[];
    path() : IPathBuilder;
}