import IPathComponent from "./IPathComponent";

export default class IndexPathComponent implements IPathComponent {
    private index : number;

    constructor(index : number) {
        this.index = index;
    }

    public toString() : string {
        return `[${this.index}]`;
    }
}