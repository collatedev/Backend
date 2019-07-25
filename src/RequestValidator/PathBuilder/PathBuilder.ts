import IPathBuilder from "./IPathBuilder";
import IPathComponent from "./IPathComponent";
import IndexPathComponent from "./IndexPathComponent";

export default class PathBuilder implements IPathBuilder {
    private pathComponents : IPathComponent[];

    constructor(pathBuilder? : IPathBuilder) {
        if (pathBuilder) {
            this.pathComponents = pathBuilder.getComponents();
        } else {
            this.pathComponents = [];
        }
    }

    public getPath() : string {
        let path : string = "";
        for (const component of this.pathComponents) {
            path += component.toString();
        }
        if (path.startsWith(".")) {
            path = path.substring(1, path.length);
        }
        return path;
    }

    public getCurrentIndex() : string {
        let currentIndex : string = "";
        let i : number = this.pathComponents.length - 1;
        while (this.pathComponents[i] instanceof IndexPathComponent) {
            currentIndex += this.pathComponents[i--].toString();
        }
        return currentIndex;
    }

    public getCurrentIndexComponents() : IPathComponent[] {
        const currentIndexComponents : IPathComponent[] = [];
        let i : number = this.pathComponents.length - 1;
        while (this.pathComponents[i] instanceof IndexPathComponent) {
            currentIndexComponents.unshift(this.pathComponents[i--]);
        }
        return currentIndexComponents;
    }

    public addPathComponent(component : IPathComponent) : void {
        this.pathComponents.push(component);
    }

    public addPathComponents(components : IPathComponent[]) : void {
        for (const component of components) {
            this.pathComponents.push(component);
        }
    }

    public popComponent() : IPathComponent {
        const poppedComponent : IPathComponent | undefined = this.pathComponents.pop();
        if (poppedComponent === undefined) {
            throw new RangeError("Can not pop a component from an empty stack");
        }
        return poppedComponent;
    }

    public popComponents(n : number) : IPathComponent[] {
        const poppedComponents : IPathComponent[] = [];
        while (n > 0) {
            poppedComponents.push(this.popComponent());
            n--;
        }
        return poppedComponents;
    }

    public getComponents() : IPathComponent[] {
        return Object.assign([], this.pathComponents);
    }
}