import { schema } from 'normalizr';
import {decompressFromEncodedURIComponent} from 'lz-string'

export interface ISiteSettings{
  node_name?: string,
  send_emails?: boolean,
}

export interface IApiResponse {
  messages?: any,
  data?: any
}

export const dataApp = new schema.Entity('dataApps');
export const dataApps = new schema.Array(dataApp);

export const dbElement = new schema.Entity('dbElements',
  {},
  {
    processStrategy: (entity) => {
      if (entity.units == '' || entity.units == null)
        entity.units = 'none'
      return entity;
    }
  });

export const dbStream = new schema.Entity('dbStreams',
  { elements: [dbElement] });
export const dbStreams = new schema.Array(dbStream)

export const eventStream = new schema.Entity('eventStreams')
export const eventStreams = new schema.Array(eventStream)

export const dbFolder = new schema.Entity('dbFolders',
  {}, {
    processStrategy: (entity) => {
      if ('subfolders' in entity) {
        entity.shallow = false;
      } else {
        entity.shallow = true
      }
      //event_stream ID values should be strings
      if('event_streams' in entity){
        entity['event_streams'] = entity.event_streams.map(
         stream => {
            stream.id = stream.id.toString();
            return stream;
        });
      }
      return entity;
    }
  });
export const dbFolders = new schema.Array(dbFolder);
dbFolder.define({
  subfolders: dbFolders,
  streams: [dbStream],
  event_streams: [eventStream]
});

export const annotation = new schema.Entity('annotations', {}, {
  processStrategy: (entity) => {
  
    //convert unix microseconds to milliseconds
    entity.start = Math.round(entity.start / 1e3);
  
    if (entity.end != null) {
      entity.end = Math.round(entity.end / 1e3);
    }

    //make a unique id but keep the API id for edit/delete calls
    entity.joule_id = entity.id
    entity.id = entity.db_stream_id+"_"+entity.id
    return entity;
  }
})
export const annotations = new schema.Array(annotation);

//convert all unix microsecond times to ms times
export const data = new schema.Entity('data', {},
  {
    idAttribute: 'element_id',
    processStrategy: (entity) => {
      if (entity.data != null) {
        entity.data = entity.data.map(d => {
          if (d != null && d.length != 0) {
            d[0] = d[0] / 1.0e3; //convert to ms
          }
          return d;
        })
      }
      if (entity.start_time != null) {
        entity.start_time = Math.round(entity.start_time / 1e3);
      }
      if (entity.end_time != null) {
        entity.end_time = Math.round(entity.end_time / 1e3);
      }
      return entity;
    }
  })
export const datas = new schema.Array(data);

//convert all unix microsecond times to ms times
export const event = new schema.Entity('event', {},
  {
    idAttribute: 'id',
    processStrategy: (entity) => {
      if (entity.events != null) {
        entity.events = entity.events.map(e => {
          if (e.end_time!= null) {
            e.end_time  = Math.round(e.end_time / 1e3); //convert to ms
          }
          e.start_time  = Math.round(e.start_time / 1e3); 
          return e;
        })
      }
      if (entity.start_time != null) {
        entity.start_time = Math.round(entity.start_time / 1e3);
      }
      if (entity.end_time != null) {
        entity.end_time = Math.round(entity.end_time / 1e3);
      }
      return entity;
    }
  })
export const events = new schema.Array(event);

export const nilm = new schema.Entity('nilms',
  { root_folder: dbFolder,
  data_apps: [dataApp] });
export const nilms = new schema.Array(nilm);

export const user = new schema.Entity('users')
export const users = new schema.Array(user);

export const permission = new schema.Entity('permissions');
export const permissions = new schema.Array(permission);

export const userGroup = new schema.Entity('user_groups',
  {
    owner: user,
    members: [user]
  });
export const userGroups = new schema.Array(userGroup);

export const dataView = new schema.Entity('data_views', {},
  {
    processStrategy: (entity) => {
      if (entity.redux_json != null) {
        let x = decompressFromEncodedURIComponent(entity.redux_json);
        entity.redux = JSON.parse(decompressFromEncodedURIComponent(entity.redux_json));
        entity.live = entity.redux.ui_explorer.live_update;
      } else {
        entity.redux = {}
      }
      entity.private = (entity.visibility!='public')
      return entity;
    }
  });
  
export const dataViews = new schema.Array(dataView);
