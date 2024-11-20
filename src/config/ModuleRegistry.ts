import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
ModuleRegistry.registerModules([ClientSideRowModelModule]);
export function moduleregistri() {
  return ModuleRegistry.registerModules([ClientSideRowModelModule,RowGroupingModule]);
}
