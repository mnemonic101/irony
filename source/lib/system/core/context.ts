import {AutoWired, Singleton, Inject, Container} from "../core/factory";

import {ILogger, IFramework, IDataContext} from "../core/interfaces";

import {Settings} from "../config/settings";

@AutoWired
@Singleton
export class Context {

  public routings: { [key: string]: any; } = {};

  public readonly settings: Settings;

  public readonly logger: ILogger;

  public readonly framework: IFramework;

  public get dataProvider(): any {
    let context: IDataContext = Container.get(IDataContext);
    return context.provider;
  }

  constructor(
    @Inject settings: Settings,
    @Inject framework: IFramework,
    @Inject logger: ILogger) {
    this.settings = settings;
    this.framework = framework;
    this.logger = logger;
  }
}
