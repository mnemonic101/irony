import {ILogger} from "../../core/interfaces";

export interface ILogData {
  message: string;
  optionalParams: any;
  timestamp: Date;
}

export class Adapter implements ILogger {

  private isFlushing: boolean = false;
  public logBuffer: ILogData[] = [];

  constructor(private config: { bufferLogs: boolean } = { bufferLogs: false }) { }

  public log(message?: any, ...optionalParams: any[]): void {

    // HACK! Deadloop possible!!! 
    // TODO: Make logger use deferred execution.
    // TODO: Find out how to handle concurrent log calls best. Is Array thread-safe?
    while (this.isFlushing) { ; }

    this.logBuffer.push({ message: message, optionalParams: optionalParams, timestamp: new Date() });

    if (!this.config.bufferLogs) {
      this.flushBuffer(this.logger);
    }
  }

  private logger(logData: ILogData) {
    let logEntry: string = logData.timestamp.toISOString() + " :: " + logData.message;
    console.log(logEntry, logData.optionalParams);
  }

  public flushBuffer(logger: (logData: ILogData) => void) {

    this.isFlushing = true;
    while (this.logBuffer.length !== 0) {
      let logData = this.logBuffer.shift();
      logger(logData);
    }
    this.isFlushing = false;
  }
}
