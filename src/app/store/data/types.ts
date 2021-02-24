import { Dictionary, EntityState } from '@ngrx/entity';
import * as plot from '../../explorer/store/plot';

// ---- Nilm ----
export interface INilm {
  id: number;
  name: string;
  description: string;
  available: boolean;
  url: string;
  role: string;
  refreshing: boolean;
  max_points_per_plot: number;
  root_folder: number; //id of database root
  data_apps: Array<number>;
}
export interface INilmState extends EntityState<INilm> { };


// ---- DataApp ----
export interface IDataApp{
  id: number;
  name: string;
  url: string;
  nilm_id: number;  //id of the NILM owner
}
export interface IDataAppState extends EntityState<IDataApp> { };


// ---- DbFolder ----
export interface IDbFolder {
  id: number;
  name: string;
  description: string;
  path: string;
  hidden: boolean;
  locked: boolean;
  subfolders: Array<number>;
  streams: Array<number>;
  start_time: number;
  end_time: number;
  size_on_disk: number;
  shallow: boolean; // true if contents have not been retrieved from server
}
export interface IDbFolderState extends EntityState<IDbFolder> { };

// ---- DbStream ----
export interface IDbStream {
  id: number;
  name: string;
  description: string;
  path: string;
  start_time: number;
  end_time: number;
  size_on_disk: number;
  total_rows: number;
  total_time: number;
  data_type: string;
  name_abbrev: string;
  locked: boolean;
  hidden: boolean;
  elements: Array<number>;
  nilm_id: number;
  reloading_annotations: boolean;
}
export interface IDbStreamState extends EntityState<IDbStream> { };

// ---- DbElements ----
export interface IDbElement {
  id: number;
  db_stream_id: number;
  name: string;
  units: string;
  column: number;
  default_max: number;
  default_min: number;
  scale_factor: number;
  offset: number;
  plottable: boolean;
  display_type: string;
  path: string; 
  //dynamically managed by the client
  color: string;
  display_name: string;
}
export interface IDbElementState extends EntityState<IDbElement> { };

// --- Stream Annotation ---
export interface IAnnotation{
  id: string;
  joule_id: number;
  db_stream_id: number;
  title: string;
  content: string;
  start: number;
  end: number
}
export interface IAnnotationState extends EntityState<IAnnotation> { };


// ---- User ----
export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}
export interface IUserState extends EntityState<IUser> { 
  current: number;
  new_installation_token: string;
  installation_token_available: boolean;
};

// ---- UserGroup ----
export interface IUserGroup {
  id: number;
  name: string;
  description: string;
  members: number[];
}
export interface IUserGroupState extends EntityState<IUserGroup>{
  owner: number[];
  member: number[];
}

// ---- Permission ----
export interface IPermission {
  id: number;
  target_name: string;
  target_type: string;
  nilm_id: number;
  role: string;
  removable: boolean
}
export interface IPremissionState extends EntityState<IPermission> { };


// ---- DataSet ----
export interface IData {
  start_time: number;
  end_time: number;
  data: any[]; //raw: [[ts, val],...]
               //decimated: [[ts, ]]
  type: string; //raw, decimated, interval
  valid: boolean;
}

export interface IDataSet {
  [index: string]: IData; //indexed by DbElement ID
}

export interface IDataViewRedux{
  ui_explorer: plot.IState,
  data_dbElements: Dictionary<IDbElement>
}

// ---- DataView ----
export interface IDataView {
  id: number;
  name: string;
  description: string;
  image: string;
  redux: IDataViewRedux;
  owner: boolean;
  live: boolean;
  private: boolean;
  home: boolean;
}


export interface IDataViewState extends EntityState<IDataView> { };
