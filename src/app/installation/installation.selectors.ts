import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { TreeNode } from 'angular-tree-component';
import {
  IDbFolderRecords,
  IDbFolderRecord,
  IDbStreamRecords,
  IDbStreamRecord,
  IDbElementRecords,
  IDbElementRecord,
  IState,
  IDbFolder,
  IDbStream,
  IDataApp,
  IDataAppRecords,
  INilm,
  INilmRecords
} from '../store/data';

import {IInstallation} from './store';
import {IAppState} from '../app.store';
import { Observable, combineLatest } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';
import { select } from '@angular-redux/store';


export interface DbTreeNode {
  id: string;
  dbId: number;
  name: string;
  type: string;
  isExpanded?: boolean;
  children: DbTreeNode[];
  hasChildren: boolean;
};

@Injectable()
export class InstallationSelectors {

  @select(['data']) data$: Observable<IState>;
  @select(['data', 'nilms']) nilms$: Observable<INilmRecords>;
  @select(['data', 'dbFolders']) dbFolders$: Observable<IDbFolderRecords>;
  @select(['data', 'dbStreams']) dbStreams$: Observable<IDbStreamRecords>;
  @select(['data', 'dbElements']) dbElements$: Observable<IDbElementRecords>;
  @select(['data', 'dataApps']) dataApps$: Observable<IDataAppRecords>;
  @select(['ui','installation']) dbAdmin$: Observable<IInstallation>;
  @select(['ui','installation', 'nilm']) nilm_id$: Observable<number>;
  @select(['ui','installation', 'refreshing']) refreshing$: Observable<boolean>;
  @select(['ui','installation', 'selectedType']) selectedType$: Observable<string>;
  @select(['ui','installation', 'rootFolderId']) root_folder_id$: Observable<number>;
  @select(['ui','installation', 'selectedDbFolder']) dbFolder_id$: Observable<number>;
  @select(['ui','installation', 'selectedDbStream']) dbStream_id$: Observable<number>;
  @select(['ui','installation', 'selectedDataApp']) dataApp_id$: Observable<number>;

  public nilm$: Observable<INilm>;
  public dbNodes$: Observable<DbTreeNode[]>;
  public rootDbFolder$: Observable<IDbFolderRecord>;
  public selectedDbFolder$: Observable<IDbFolderRecord>;
  public selectedDbStream$: Observable<IDbStreamRecord>;
  public selectedDataApp$: Observable<IDataApp>;
  public selectedDbStreamElements$: Observable<IDbElementRecord[]>;


  constructor(
    private ngRedux: NgRedux<IAppState>
  ) {
    // ---- nilm: INilm ------
    this.nilm$ = combineLatest(
      this.nilm_id$,this.nilms$).pipe(
      map(([id, nilms]) => nilms[id]),
      filter(nilm => !(nilm === undefined)));


    // ---- selectedDbRootFolder: IDbFolderRecord ------
    this.rootDbFolder$ = combineLatest(
      this.root_folder_id$,this.dbFolders$).pipe(
      map(([id, folders]) => folders[id]),
      filter(folder => !(folder === undefined)));

    // ---- selectedDbFolder: IDbFolderRecord ------
    this.selectedDbFolder$ = combineLatest(
      this.dbFolders$,this.dbFolder_id$).pipe(
      map(([dbFolders, id]) => dbFolders[id]),
      filter(dbFolder => !(dbFolder === undefined)),
      distinctUntilChanged());

    // ---- selectedDataApp: IDataAppRecord ------
    this.selectedDataApp$ = combineLatest(
      this.dataApps$,this.dataApp_id$).pipe(
      map(([dataApps, id]) => dataApps[id]),
      filter(app => !(app === undefined)),
      distinctUntilChanged(),
      );

    // ---- selectedDbStream: IDbStreamRecord ------
    this.selectedDbStream$ = combineLatest(
      this.dbStreams$, this.dbStream_id$).pipe(
      map(([dbStreams, id]) => dbStreams[id]),
      filter(dbStream => !(dbStream === undefined)),
      distinctUntilChanged());


    // ---- selectedDbElements: IDbElements[] -----
    this.selectedDbStreamElements$ = combineLatest(
      this.selectedDbStream$,this.dbElements$).pipe(
       map(([stream, elements]) => stream.elements.map(id => elements[id])),
       filter(elements =>
        elements.reduce((i, e) => i && !(e === undefined), true)),
      distinctUntilChanged());

    // ---- dbNodes: DbTreeNode[] -----
    this.dbNodes$ = combineLatest(
      this.root_folder_id$, this.data$).pipe(
      filter(([root_id, data]) => data.dbFolders[root_id] !== undefined),
      map(([root_id, data]) => this._mapRoot(data, data.dbFolders[root_id]))
    );
  }

  ///----------- Tree Helper Functions -----------------------
  ///
  private _mapRoot(data: IState, root: IDbFolder): DbTreeNode[] {
    let dbs = this._mapFolder(data, root);
    dbs.name='database';
    dbs.type='root';
    dbs.isExpanded = true;
    //let interfaces= this._mapInterfaces(data.jouleModules)
    return [ dbs];
  }
  private _mapFolder(data: IState, folder: IDbFolder): DbTreeNode {
    let children = null;

    //if folder is loaded, map children
    if (!folder.shallow) {
      children = [].concat(
        //first map subfolders
        folder.subfolders
          .filter(id => data.dbFolders[id] !== undefined)
          .map(id => this._mapFolder(data,data.dbFolders[id])),
        //now map streams
        folder.streams
          .filter(id => data.dbStreams[id] !== undefined)
          .map(id => this._mapStream(data, data.dbStreams[id])))
    }
    /*
    if (!dbFolder.shallow) {
      children =
        dbFolder.subfolders
          .map(subfolder_id => this._mapFolder(data, subfolder_id))
          .concat(dbFolder.streams
            .filter(stream_id => stream_id in data.dbStreams)
            .map(stream_id => this._mapStream(data, stream_id)));
    }*/
    return {
      id: 'f'+folder.id,
      dbId: folder.id,
      name: folder.name,
      type: 'dbFolder',
      children: children,
      hasChildren: true,
    };
  }

  private _mapStream(data: IState, stream: IDbStream ): DbTreeNode {
    return {
      id: 's'+stream.id,
      dbId: stream.id,
      name: stream.name,
      type: 'dbStream',
      hasChildren: false,
      children: []
    };
  }

  private _mapInterfaces(modules: IDataApp[]): DbTreeNode {
    let nodes = modules.map( a => { return {
      id: 'a'+a.id,
      dbId: a.id,
      name: a.name,
      type: 'dataApp',
      hasChildren: false,
      children: []
    }})
    return {
      id: 'mroot',
      dbId: 0,
      name: 'root',
      type: 'jouleModule',
      children: nodes,
      hasChildren: true,
    };
  }
}
