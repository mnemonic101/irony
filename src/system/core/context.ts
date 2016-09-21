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

  private _dataProvider: any;
  public get dataProvider(): any {
    return this._dataProvider;
  }
  public set dataProvider(value: any) {
    this._dataProvider = value;
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
