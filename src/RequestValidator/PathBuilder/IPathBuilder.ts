import IPathComponent from "./IPathComponent";

export default interface IPathBuilder {
    addPathComponent(component : IPathComponent) : void;
    addPathComponents(components : IPathComponent[]) : void;
    popComponent() : IPathComponent;
    popComponents(n : number) : IPathComponent[];
    getPath() : string;
    getCurrentIndex() : string;
    getCurrentIndexComponents() : IPathComponent[];
    getComponents() : IPathComponent[];
}