import {ILogger} from "../../core/interfaces";

export class Adapter implements ILogger {

  public log(message?: any, ...optionalParams: any[]): void {
    let logEntry: string = new Date().toISOString() + " :: " + message;
    console.log(logEntry, optionalParams);
  }
}
