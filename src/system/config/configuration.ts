import {AutoWired, Inject, Singleton} from "../core/factory";

import {Package} from "../config/package";
import {Settings} from "../config/settings";

@AutoWired
@Singleton
export class Configuration {

  private _package: Package;
  public get package(): Package {
    return this._package;
  }

  private _settings: Settings;
  public get settings(): Settings {
    return this._settings;
  }

  constructor(@Inject pconfig: Package, @Inject sconfig: Settings){
    this._package = pconfig;
    this._settings = sconfig;

    this.checkBasePath();
  }

  private checkBasePath(): void {
    // TODO: check if base path is given in settings.json or package.json,
    //       and if it is correct!  
  }
}
