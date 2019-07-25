import INestedArray from './INestedArray';
import IPathBuilder from '../PathBuilder/IPathBuilder';
import PathBuilder from '../PathBuilder/PathBuilder';

export default class NestedArray implements INestedArray {
    private readonly _value : any[];
    private readonly _depth : number;
    private readonly _path : IPathBuilder;

    constructor(value : any, depth : number, pathBuilder: IPathBuilder) {
        if (value === null) {
            throw new Error("Array value must not be null");
        }
        if (!Array.isArray(value)) {
            throw new Error("Value must be an array");
        }
        if (depth < 0) {
            throw new Error("Depth can not be less than 0");
        }
        this._value = Object.assign([], value);
        this._depth = depth;
        this._path = new PathBuilder(pathBuilder);
    }

    public value() : any[] {
        return this._value;
    }

    public depth() : number {
        return this._depth;
    }

    public path() : IPathBuilder {
        return this._path;
    }
}