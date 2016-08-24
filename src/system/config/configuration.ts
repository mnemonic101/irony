import {AutoWired, Inject, Singleton} from "../core/factory";
import {FileSystemHelper} from "../core/helper";
import * as path from "path";

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

  private _appBasePath: string;
  public get appBasePath(): string {
    return this._appBasePath;
  }

  private _coreBasePath: string;
  public get coreBasePath(): string {
    return this._coreBasePath;
  }

  constructor(@Inject pconfig: Package, @Inject sconfig: Settings){
    this._package = pconfig;
    this._settings = sconfig;

    this.checkBasePath();
  }

  private checkBasePath(): void {
    this._coreBasePath = FileSystemHelper.locateFolderOf(this.settings.basePath, false);

    // HACK: We need to know where we are somehow?!
    // TODO: Find a better way to resolve the applications base path! 
    this._appBasePath = path.posix.parse(this.package.srcFile).dir + this.settings.basePath;

    // TODO: check if base path is given in settings.json or package.json,
    //       and if it is correct!  
  }
}
