import {AutoWired, Singleton, Inject} from "../core/factory";

import {ILogger, IFramework} from "../core/interfaces";

import {Settings} from "../config/settings";

@AutoWired
@Singleton
export class Context {

  public routings: { [key: string]: any; } = {};

  private _settings: Settings;
  public get settings(): Settings {
    return this._settings;
  }

  private _logger: ILogger;
  public get logger(): ILogger {
    return this._logger;
  }

  private _framework: IFramework;
  public get framework(): IFramework {
    return this._framework;
  }

  constructor(
    @Inject framework: IFramework,
    @Inject logger: ILogger,
    @Inject settings: Settings) {
    this._framework = framework;
    this._logger = logger;
    this._settings = settings;
  }
}
