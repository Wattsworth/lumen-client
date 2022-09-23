
import * as types from './types';

export function entityFactory<T>(entities: any, defaultState: T){
  if(entities===undefined || entities.length==0){
    return [];
  }
  return Object.values(entities).map(entity => {return Object.assign({},defaultState,entity)});
}

// ---- Nilm ----
export const defaultNilm: types.INilm = {
  id: null,
  name: '',
  description: '',
  url: '',
  role: '',
  available: false,
  data_apps: [],
  refreshing: false,
  root_folder: null,
  max_points_per_plot: 0,
  max_events_per_plot: 0
};

// ---- DataApp ----
export const defaultDataApp: types.IDataApp = { 
  id: null,
  url: '',
  name: '',
  nilm_id: null
};

// ---- DbFolder ----
export const defaultDbFolder: types.IDbFolder = {
  id: null,
  name: '',
  description: '',
  path: '',
  hidden: false,
  subfolders: [],
  streams: [],
  event_streams: [],
  shallow: true,
  start_time: null,
  end_time: null,
  size_on_disk: 0,
  locked: false
};

// ---- DbStream ----
export const defaultDbStream: types.IDbStream = {
  id: null,
  name: '',
  description: '',
  path: '',
  start_time: null,
  end_time: null,
  total_rows: 0,
  total_time: 0,
  data_type: '',
  name_abbrev: '',
  locked: false,
  hidden: false,
  elements: null,
  size_on_disk: 0,
  nilm_id: null,
  reloading_annotations: false
};

// ---- EventStream ----

export const defaultEventStreamPlotSettings: types.IEventStreamPlotSettings = {
  display_name: '', //use the eventStream name
  color: {
    type: 'fixed', //fixed, attribute, numeric
    value: {
      fixed: null,     //initialized to default_color
      attribute: '',   //use this attribute as CSS color
      numeric: {       //apply a color map
        attribute: '', //  use this attribute as the numeric value for the event
        min: 0,        //  left end of color map
        max: 0         //  right end of color map
      }
    }
  },
  marker: {
    type: 'fixed',
    size: 12,
    value: {
      fixed: '.',
      attribute: ''
    }
  },
  label: {
    type: 'none',
    size: 12,
    value: {
      fixed: '',
      attribute: ''
    }
  },
  position: {
    type: 'fixed',
    axis: 'float',
    value: {
      fixed: '0',
      attribute: ''
    }
  },
  height: {
    type: 'fixed',
    value: {
      fixed: '0.25',
      attribute: ''
    }
  }
}

export const defaultEventStream: types.IEventStream = {
  id: null,
  name: '',
  description: '',
  path: '',
  start_time: null,
  end_time: null,
  event_count: 0,
  nilm_id: null,
  event_fields: {},
  //managed by the client
  default_color: null,
  plot_settings: defaultEventStreamPlotSettings,
  filter_groups: []
};
// ---- DbElement ----
export const defaultDbElement: types.IDbElement = {
  id: null,
  db_stream_id: null,
  name: '',
  units: 'none',
  column: null,
  default_max: null,
  default_min: null,
  scale_factor: 1.0,
  offset: 0.0,
  plottable: true,
  display_type: '',
  path: '',
  color: null,
  display_name: ''
};

// ---- Annotation ----
export const defaultAnnotation: types.IAnnotation = {
  id:null,
  joule_id: null,
  db_stream_id: null,
  title: '',
  content: '',
  start: null,
  end: null
};

// ---- Data ----
export const defaultData: types.IData = {
  start_time: null,
  end_time: null,
  data: [],
  type: 'unknown',
  valid: true
};

// ---- Event ----
export const defaultEvent: types.IEvents = {
  start_time: null,
  end_time: null,
  valid: true,
  count: 0,
  events: [],
};

// ---- User ----
export const defaultUser: types.IUser = {
  id: null,
  first_name: null,
  last_name: null,
  email: null
};


// ---- UserGroup ----
export const defaultUserGroup: types.IUserGroup = {
  id: null,
  name: '',
  description: '',
  members: []
};


// ---- Permission ----
export const defaultPermission: types.IPermission = {
  id: null,
  target_name: '',
  target_type: 'unknown',
  role: 'invalid',
  nilm_id: null,
  removable: false
};

// --- DataView ----
export const defaultDataView: types.IDataView = { 
  id: null,
  name: '',
  description: '',
  image: '',
  redux: null,
  owner: false,
  live: false,
  private: false,
  home: false
};

// --- DataViewRedux ----
export const defaultDataViewRedux: types.IDataViewRedux = {
  ui_explorer: null,
  data_dbElements: {},
  data_eventStreams: {}
}
