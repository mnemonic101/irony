import {AutoWired, Inject, Singleton} from "../core/factory";
import {FileSystemHelper} from "../core/utils";

import {Package} from "../config/package";
import {Settings} from "../config/settings";

@AutoWired
@Singleton
export class Configuration {

  public readonly package: Package;

  public readonly settings: Settings;

  public readonly appBasePath: string;

  public readonly coreBasePath: string;

  constructor(@Inject pconfig: Package, @Inject sconfig: Settings){
    this.package = pconfig;
    this.settings = sconfig;

    this.coreBasePath = FileSystemHelper.locateFolderOf("system", false, __dirname);
    this.appBasePath = process.cwd() + this.settings.basePath;

    // TODO: check if base path is given in settings.json or package.json,
    //       and if it is correct!  
  }
}
