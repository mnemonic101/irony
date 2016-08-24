import {ILogger} from "../../core/interfaces";

export class Adapter implements ILogger {

  public log(message?: any, ...optionalParams: any[]): void {
    console.log(message, optionalParams);
  }
}
