import ILogger from "../../src/Logging/ILogger";

export default class MockLogger implements ILogger {
    public debug() : void {
        return;
    }
    
    public error() : void {
        return;
    }
    
    public info() : void {
        return;
    }

    public warn() : void {
        return;
    }
}