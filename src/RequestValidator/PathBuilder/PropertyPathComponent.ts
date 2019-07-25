import IPathComponent from "./IPathComponent";

export default class PropertyPathComponent implements IPathComponent {
    private property : string;

    constructor(property : string) {
        this.property = property;
    }

    public toString() : string {
        if (this.property.includes(".")) {
            return `."${this.property}"`;
        } else {
            return `.${this.property}`;
        }
    }
}