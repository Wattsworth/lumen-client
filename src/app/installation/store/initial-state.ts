
import {
  IInstallation,
  IInstallationRecord,
} from './types';

import { makeTypedFactory } from 'typed-immutable-record';


// ---- Installation ----
export const InstallationFactory =
  makeTypedFactory<IInstallation, IInstallationRecord>({
    selectedType: 'unknown',
    selectedDbFolder: null,
    selectedDbStream: null,
    selectedDataApp: null,
    //rootFolderId: null,
    nilm: null,
    refreshing: false,
    busy: false
  });


export const INITIAL_STATE = InstallationFactory();
