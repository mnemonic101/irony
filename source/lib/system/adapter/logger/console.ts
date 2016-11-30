import { ILogger, LogLevel, LogSeverity } from "../../core/interfaces";
import * as AnsiColorCodes from "./ansicolorcodes";

export interface ILogData {
  message: string;
  optionalParams: any;
  timestamp: Date;
  severity: LogSeverity;
  level: LogLevel;
  config: any;
}

export class Adapter implements ILogger {

  private config: {
    bufferLogs?: boolean,
    level?: LogLevel,
    delimiter?: string
  };
  private isFlushing: boolean = false;
  public logBuffer: ILogData[] = [];

  constructor(config: {} = {}) {
    let {
      bufferLogs = false,
      level = LogLevel.Log,
      delimiter = " | " }: {
        bufferLogs?: boolean,
        level?: LogLevel,
        delimiter?: string
      } = config;

    this.config = { bufferLogs: bufferLogs, level: level, delimiter: delimiter };
  }

  public isLogLine(message: string): boolean {
    // TODO: Create regular expression for log line matching dynamically (e.g. delimiter).
    const regEx: RegExp = /.{0,4}(-?\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?)((?:[\+\-]\d{2}:\d{2})|UTC|GMT|Z).{0,4} \| /;
    return message.match(regEx) != null;
  }

  public log(message: any, ...optionalParams): void {
    // TODO: implement object formatter for ILogger
    if (message instanceof Object && !!(message["message"])) {
      this.writeLogData(message as ILogData);
    } else {
      this.writeLog(LogLevel.Log, LogSeverity.Log, message, optionalParams);
    }
  }

  public debug(message: any, ...args): void {
    this.writeLog(LogLevel.Debug, LogSeverity.Log, message, args);
  }

  public info(message: any, ...args): void {
    this.writeLog(LogLevel.Info, LogSeverity.Info, message, args);
  }

  public warn(message: any, ...args): void {
    this.writeLog(LogLevel.Warn, LogSeverity.Warn, message, args);
  }

  public error(message: any, ...args): void {
    this.writeLog(LogLevel.Error, LogSeverity.Error, message, args);
  }

  public fatal(message: any, ...args): void {
    this.writeLog(LogLevel.Fatal, LogSeverity.Error, message, args);
  }

  private writeLogData(logData: ILogData) {
    this.writeLog(logData.level, logData.severity, logData.message, logData.optionalParams);
  }

  private async writeLog(level: LogLevel, severity: LogSeverity, message?: any, ...optionalParams): void {

    // Fast exit!
    if (level < this.config.level) return;

    // HACK! Deadloop possible!!! 
    // TODO: Make logger use deferred execution.
    // TODO: Find out how to handle concurrent log calls best. Is Array thread-safe?
    // while (this.isFlushing) { ; }

    this.logBuffer.push({
      message: message,
      optionalParams: optionalParams,
      timestamp: new Date(),
      severity: severity,
      level: level,
      config: this.config
    });

    if (!this.config.bufferLogs) {
      await this.flushBuffer(this.logger);
    }
  }

  private logger(logData: ILogData) {
    let logEntry: string = "";
    switch (logData.severity) {
      case LogSeverity.Error:
        logEntry += AnsiColorCodes.Foreground.lightRed;
        break;
      case LogSeverity.Warn:
        logEntry += AnsiColorCodes.Foreground.lightYellow;
        break;
      case LogSeverity.Info:
        logEntry += AnsiColorCodes.Foreground.lightCyan;
        break;
      default:
        logEntry += AnsiColorCodes.Foreground.lightGray;
        break;
    }

    logEntry += logData.timestamp.toISOString();
    if (logData.severity === LogSeverity.Log) logEntry += AnsiColorCodes.TextAttributes.reset;
    logEntry += logData.config.delimiter;
    logEntry += process.pid;
    logEntry += logData.config.delimiter;
    logEntry += LogLevel[logData.level];
    logEntry += logData.config.delimiter;
    logEntry += logData.message;
    if (logData.severity !== LogSeverity.Log) logEntry += AnsiColorCodes.TextAttributes.reset;

    logEntry = logEntry.replace(/\s+/g, " ").replace(process.cwd(), ".");

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
