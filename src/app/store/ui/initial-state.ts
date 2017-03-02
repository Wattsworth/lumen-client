import {
  IUI,
  IUIRecord,
  IStatusMessages,
  IStatusMessagesRecord
} from './types';

import { makeTypedFactory } from 'typed-immutable-record';

// --- Status Messages ---
export const StatusMessagesFactory =
  makeTypedFactory<IStatusMessages, IStatusMessagesRecord>({
    notices: [],
    errors: [],
    warnings: []
  });


// ---- Page ----
export const PageFactory =
  makeTypedFactory<IUI, IUIRecord>({
    messages: StatusMessagesFactory(),
  });


export const INITIAL_STATE = PageFactory();
