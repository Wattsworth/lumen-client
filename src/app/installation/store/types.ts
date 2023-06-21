
// ---- Installation ----
export interface IInstallation {
  selectedType?: string;
  selectedDbFolder?: number;
  selectedDbStream?: number;
  selectedEventStream?: number;
  selectedDataApp?: number;
  nilm?: number;
  rootFolderId?: number;
  refreshing?: boolean;
  busy?: boolean;
  expanded_nodes?: string[];
}
