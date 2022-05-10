
import {
  IInstallation,
} from './types';



// ---- Installation ----
export const defaultInstallation: IInstallation = {
  selectedType: 'unknown',
  selectedDbFolder: null,
  selectedDbStream: null,
  selectedEventStream: null,
  selectedDataApp: null,
  rootFolderId: null,
  nilm: null,
  refreshing: false,
  busy: false
};
