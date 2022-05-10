import { Component, Input, OnInit } from '@angular/core';
import { TreeNode } from 'angular-tree-component';
import { Observable, Subscription } from 'rxjs';

import {
  DbFolderService,
} from '../../../services';
import { InstallationService } from '../../installation.service';
import { InstallationSelectors } from '../../installation.selectors';
import {
  INilm,
  IDbFolder,
  IDbStream,
  IEventStream,
  IDataApp
} from '../../../store/data';
import { combineLatest } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { data } from '../../../api';
import { EntityState } from '@ngrx/entity';
import { Dictionary } from '@ngrx/entity';

@Component({
  selector: 'installation-database-tab',
  templateUrl: './database.tab.html',
  styleUrls: ['./database.tab.css']
})
export class DatabaseTabComponent {

  @Input() nilm: INilm;

  private subs: Subscription[];
  public nilmTree$: Observable<DbTreeNode[]>

  constructor(
    public installationService: InstallationService,
    private dbFolderService: DbFolderService,
    public installationSelectors: InstallationSelectors,
  ) {
    this.subs = [];
   
    this.nilmTree$ = combineLatest(
      [this.installationSelectors.nilm$,
      this.installationSelectors.data$]).pipe(
        
        map(([nilm, data]) => this.mapNilm(nilm, 
          data.dataApps.entities,
          data.dbFolders.entities,
          data.dbStreams.entities,
          data.eventStreams.entities)));
      
    
  };

  public refresh(){
    this.installationService.refresh(this.nilm);
  }
  
  public toggleNode(event: any){
    if(event.isExpanded == false)
      return; //nothing to do
    let node = event.node;
    if(node.hasChildren && node.children == null){
      this.dbFolderService.loadFolder(node.data.dbId);
    }
  }

  public selectNode(event) {
    let node: TreeNode = event.node;
    switch (node.data.type) {
      case 'dbFolder':
        this.installationService.selectDbFolder(node.data.dbId);
        return;
      case 'dbStream':
        this.installationService.selectDbStream(node.data.dbId);
        return;
      case 'dataApp':
        this.installationService.selectDataApp(node.data.dbId);
        return;
      case 'eventStream':
        this.installationService.selectEventStream(node.data.dbId);
        return;
      default:
        console.log(`unknown type ${node.data.type}`);
    }
  }

  mapNilm(
    nilm: INilm,
    data_apps: {[id: number]: IDataApp },
    folders: {[id: number]: IDbFolder },
    streams: {[id: number]: IDbStream },
    eventStreams: Dictionary<IEventStream>,
  ): DbTreeNode[] {    

    //first map folders
    let root = folders[nilm.root_folder]
    if(root===undefined){
      return [] //waiting on the root node
    }
    let folder_nodes = root.subfolders
      .filter(id => folders[id] !== undefined)
      .map(id => this.mapFolder(
        folders[id], folders, streams, eventStreams))
    let module_nodes = this.mapDataApps(nilm.data_apps, data_apps)
    return module_nodes.concat(folder_nodes);
    }
  

  mapDataApps(
    moduleIds: Array<number>,
    dataApps:  {[id: number]: IDataApp },
  ): DbTreeNode[]{
    return moduleIds.map(id => dataApps[id])
    .filter(app => app !== undefined)
    .map(app => {
      return {
      id: 'a'+app.id,
      dbId: app.id,
      type: 'dataApp',
      name: app.name,
      children: [],
      hasChildren: false
      }
    })
  }

  mapFolder(
    folder: IDbFolder,
    folders:  {[id: number]: IDbFolder },
    streams:  {[id: number]: IDbStream },
    eventStreams: Dictionary<IEventStream>
  ): DbTreeNode {
    let children = null;
    //if folder is loaded, map children
    if (!folder.shallow) {
      children = [].concat(
        //first map subfolders
        folder.subfolders
          .filter(id => folders[id] !== undefined)
          .map(id => this.mapFolder(
            folders[id], folders, streams, eventStreams))
            .sort((a,b) => a.name > b.name ? 1:-1),
        //now map streams
        folder.streams
          .filter(id => streams[id] !== undefined)
          .map(id => this.mapStream(
            streams[id]))
          .sort((a,b) => a.name > b.name ? 1:-1),
        //now map event streams
        folder.event_streams
          .filter(id => eventStreams[id] !== undefined)
          .map(id => this.mapEventStream(eventStreams[id]))
          .sort((a,b) => a.name > b.name ? 1:-1))
    }
    //create the DbNode and return it
    return {
      id: 'f' + folder.id,
      dbId: folder.id,
      name: folder.name,
      type: 'dbFolder',
      children: children,
      hasChildren: true
    }
  }

  mapStream(
    stream: IDbStream,
  ): DbTreeNode {
    return {
      id: 's' + stream.id,
      dbId: stream.id,
      name: stream.name,
      type: 'dbStream',
      children: [],
      hasChildren: false
    }
  }

  mapEventStream(
    stream: IEventStream,
  ): DbTreeNode {
    return {
      id: 'v' + stream.id,
      dbId: stream.id,
      name: stream.name,
      type: 'eventStream',
      children: [],
      hasChildren: false
    }
  }

  ngOnDestroy() {
    for (var sub of this.subs) {
      sub.unsubscribe();
    }
  }
}

export interface DbTreeNode {
  id: string;
  dbId: number;
  name: string;
  type: string;
  refreshing?: boolean;
  isExpanded?: boolean;
  children: DbTreeNode[];
  hasChildren: boolean;
  priveleged?: boolean;
  nilmId?: number;
};