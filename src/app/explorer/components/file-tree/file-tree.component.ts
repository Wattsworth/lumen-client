
import {combineLatest} from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TreeNode } from 'angular-tree-component';

import {
  NilmService,
  DbFolderService,
} from '../../../services';
import {
  INilm,
  IDbFolder,
  IDbStream,
  IDbElement,
  IDataApp,
  IData
} from '../../../store/data';
import { 
  PlotService,
  InterfacesService 
} from '../../services';
import { 
  PlotSelectors,
} from '../../selectors';
import { Dictionary } from '@ngrx/entity';

@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.css']
})

export class FileTreeComponent implements OnInit {
  public dbNodes$: Observable<DbTreeNode[]>;

  constructor(
    public nilmService: NilmService,
    private dbFolderService: DbFolderService,
    public plotService: PlotService,
    public plotSelectors: PlotSelectors,
    public interfacesService: InterfacesService
  ) {
  }

  ngOnInit() {
    this.nilmService.loadNilms()
      .subscribe(() => { },
      () => { },
      () => this.plotService.setNilmsLoaded());

    
    this.dbNodes$ = combineLatest([
      this.plotSelectors.data$,
      this.plotSelectors.plottedElements$])
      .pipe(map(([data,elements]) => {
        let nilms = Object.values(data.nilms.entities);
        return nilms.map(nilm => {
          return this.mapNilm(nilm, 
            data.dbFolders.entities[nilm.root_folder],
            data.dataApps.entities,
            data.dbFolders.entities, 
            data.dbStreams.entities, 
            data.dbElements.entities)
        }).sort((a,b) => a.name > b.name ? 1:-1)
      }));
  }

  public toggleNode(event: any){
    if(event.isExpanded == false)
      return; //nothing to do
    let node = event.node;
    if(node.hasChildren && node.children == null){
      this.getChildren(node);
    }
  }
  public getChildren(node: TreeNode) {
    let id = node.data.id.slice(1, node.data.id.len);
    switch (node.data.type) {
      case 'nilm':
        this.nilmService.loadNilm(id);
        return [];
      case 'dbFolder':
        this.dbFolderService.loadFolder(id);
        return [];
    }
  }

  mapNilm(
    nilm: INilm,
    rootDbFolder: IDbFolder,
    dataApps: Dictionary<IDataApp>,
    folders: Dictionary<IDbFolder>,
    streams: Dictionary<IDbStream>,
    elements: Dictionary<IDbElement>,
  ): DbTreeNode {
    let children = null
    if (rootDbFolder !== undefined) {
      //nilm is loaded, map it out
      let root = this.mapFolder(rootDbFolder,
        folders, streams, elements);
      //add the Joule Modules to the top of the folder listing
      root.children.unshift(...this.mapJouleModules(
        nilm.data_apps, dataApps));
      return Object.assign({}, root, {
        id: 'n' + nilm.id,
        type: 'nilm',
        refreshing: nilm.refreshing,
        nilmId: nilm.id,
        name: nilm.name
      });
    } else {
      //nilm is a stub, it has not been loaded
      return {
        id: 'n' + nilm.id,
        type: 'nilm',
        refreshing: nilm.refreshing,
        nilmId: nilm.id,
        name: nilm.name,
        children: null,
        hasChildren: true
      }
    }
  }

  mapJouleModules(
    appIds: Array<number>,
    dataApps: Dictionary<IDataApp>
  ): DbTreeNode[]{
    return appIds.map(id => dataApps[id])
    .filter(app => app !== undefined)
    .map(app => {
      return {
      id: 'a'+app.id,
      type: 'dataApp',
      name: app.name,
      link: app.url,
      children: [],
      hasChildren: false
      }
    })
  }

  mapFolder(
    folder: IDbFolder,
    folders: Dictionary<IDbFolder>,
    streams: Dictionary<IDbStream>,
    elements: Dictionary<IDbElement>,
  ): DbTreeNode {
    let children = null;
    //if folder is loaded, map children
    if (!folder.shallow) {
      children = [].concat(
        //first map subfolders
        folder.subfolders
          .filter(id => folders[id] !== undefined)
          .map(id => this.mapFolder(
            folders[id], folders, streams, elements))
          .sort((a,b) => a.name > b.name ? 1:-1),
        //now map streams
        folder.streams
          .filter(id => streams[id] !== undefined)
          .map(id => this.mapStream(
            streams[id], elements)))
          .sort((a,b) => a.name > b.name ? 1:-1)

    }
    //create the DbNode and return it
    return {
      id: 'f' + folder.id,
      name: folder.name,
      type: 'dbFolder',
      children: children,
      hasChildren: true
    }
  }

  mapStream(
    stream: IDbStream,
    elements: Dictionary<IDbElement>
  ): DbTreeNode {
    let children = stream.elements
      .map(id => elements[id])
      .filter(element => element !== undefined)
      .filter(element => element.plottable)
      .sort((a,b) => a.column - b.column)
      .map(element => this.mapElement(element))
    //create the DbNode and return it
    return {
      id: 's' + stream.id,
      name: stream.name,
      type: 'dbStream',
      children: children,
      hasChildren: children != null
    }
  }

  mapElement(
    element: IDbElement,
  ): IDbElementNode {
    let plotted = this.plotService.isPlotted(element);
    let plottable = this.plotService.isPlottable(element.units);

    let tooltip = "";
    if (plottable == false) {
      tooltip = `no axis for [ ${element.units} ]`;
    }
    //create the DbNode and return it
    return {
      id: 'e' + element.id,
      name: element.name,
      type: 'dbElement',
      element: element,
      plotted: plotted,
      plottable: plottable,
      color: element.color,
      tooltip: tooltip,
      children: [],
      hasChildren: false
    }
  }
}


export interface DbTreeNode {
  id: string;
  name: string;
  type: string;
  refreshing?: boolean;
  isExpanded?: boolean;
  children: DbTreeNode[];
  hasChildren: boolean;
  priveleged?: boolean;
  nilmId?: number;
};
export interface IDbElementNode
  extends DbTreeNode {
  element: IDbElement;
  plotted: boolean;
  plottable: boolean;
  tooltip: string;
  color: string;
}