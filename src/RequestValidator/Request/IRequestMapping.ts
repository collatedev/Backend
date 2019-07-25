export default interface IRequestMapping { 
    keys(): string[];
    value(key : string) : any;
    has(key : string) : boolean;
}