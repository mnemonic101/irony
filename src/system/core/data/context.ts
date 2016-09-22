import {AutoWired, Singleton, Provides} from "../factory";
import {IDataContext} from "../interfaces";

@AutoWired
@Singleton
@Provides(IDataContext)
export class DataContext implements IDataContext {
  public provider: any;
}
